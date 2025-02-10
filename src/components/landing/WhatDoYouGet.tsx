import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Create Job Descriptions with AI",
    description: "Generate comprehensive job descriptions in seconds using AI. Our platform analyzes industry standards and your specific requirements to create accurate, engaging job posts.",
    gradient: "bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] animate-gradient"
  },
  {
    title: "Create Job Assessments with AI",
    description: "Design custom skill assessments with AI-generated questions that accurately evaluate candidates' abilities. Create relevant, challenging tests that reflect real-world scenarios.",
    gradient: "bg-gradient-to-br from-[#accbee] to-[#e7f0fd] animate-gradient"
  },
  {
    title: "Review Candidate Answers with AI",
    description: "Let AI analyze candidate responses quickly and objectively. Get detailed insights into candidates' performance with automated scoring and comprehensive feedback.",
    gradient: "bg-gradient-to-r from-[#ee9ca7] to-[#ffdde1] animate-gradient"
  },
  {
    title: "Video, Audio, MCQs, and descriptive questions",
    description: "Choose from multiple question formats to thoroughly assess candidates. Create diverse assessments that test both technical skills and soft skills through various mediums.",
    gradient: "bg-gradient-to-br from-[#d299c2] to-[#fef9d7] animate-gradient"
  }
];

export const WhatDoYouGet = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center dark:text-[#F5F5F5] text-[#141414]">
          AI Is Here To Help You Hire
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-10 ${feature.gradient} flex items-center justify-center bg-[size:200%]`}>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white/20" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg dark:text-[#F5F5F5] text-[#141414]">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600 text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};