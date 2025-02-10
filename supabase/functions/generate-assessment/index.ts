import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    console.log('Generating assessment for topic:', topic);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Using the faster model for better response times
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating technical assessments. Create a technical assessment with 5 multiple choice questions about the given topic.
            
            Return ONLY a JSON object in this exact format:
            {
              "questions": [
                {
                  "question": "What is...",
                  "options": ["option1", "option2", "option3", "option4"],
                  "correctAnswer": 0,
                  "explanation": "Detailed explanation of why this is correct"
                }
              ]
            }

            Rules:
            - Return ONLY the JSON object, no other text
            - Include exactly 5 questions
            - Each question must have exactly 4 options
            - correctAnswer must be a number 0-3 indicating the index of the correct option
            - Each question must have an explanation
            - Make sure the JSON is valid and properly formatted`
          },
          {
            role: 'user',
            content: `Create a technical assessment about: ${topic}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI raw response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }

    try {
      const content = data.choices[0].message.content.trim();
      console.log('Parsing response:', content);
      
      const parsedResponse = JSON.parse(content);
      
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        console.error('Response missing questions array:', parsedResponse);
        throw new Error('Invalid response format: missing questions array');
      }

      const questions = parsedResponse.questions;

      if (questions.length !== 5) {
        console.error('Incorrect number of questions:', questions.length);
        throw new Error('Must have exactly 5 questions');
      }

      questions.forEach((q: Question, index: number) => {
        if (!q.question || typeof q.question !== 'string') {
          throw new Error(`Question ${index + 1} is invalid`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Options for question ${index + 1} must be an array of exactly 4 items`);
        }
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Correct answer for question ${index + 1} must be a number between 0 and 3`);
        }
        if (!q.explanation || typeof q.explanation !== 'string') {
          throw new Error(`Explanation for question ${index + 1} is required`);
        }
      });

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse AI response into valid question format');
    }
  } catch (error) {
    console.error('Error in generate-assessment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});