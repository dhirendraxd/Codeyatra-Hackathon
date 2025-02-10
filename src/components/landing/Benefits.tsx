import { Check } from "lucide-react";

const employerBenefits = [
  {
    title: "Save Time & Money",
    description: "Speed up your hiring process with AI-driven assessments.",
  },
  {
    title: "Hire with Confidence",
    description: "Get deeper insights into candidates' actual skills, not just their resumes.",
  },
  {
    title: "AI-Powered Scoring",
    description: "Let AI evaluate candidates' answers and provide you with a detailed score, saving you time and ensuring objective results.",
  },
  {
    title: "Customizable Flexibility",
    description: "Tailor assessments to your exact job requirements and needs.",
  },
];

const jobSeekerBenefits = [
  {
    title: "Improve Your Hiring Chances",
    description: "Get noticed by top employers by showcasing your skills through real-world assessments.",
  },
  {
    title: "Practice Real-World Scenarios",
    description: "Prepare for jobs by taking tests that reflect tasks you'll actually perform.",
  },
  {
    title: "AI-Powered Feedback",
    description: "Receive immediate feedback on your answers with AI-generated scores, helping you improve for future opportunities.",
  },
  {
    title: "Flexible Application Process",
    description: "Apply to jobs and complete assessments when it's convenient for you.",
  },
];

export const Benefits = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Benefits
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-8 dark:text-[#F0EAD6] text-[#36454F]">For Employers</h3>
            <div className="space-y-8">
              {employerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-testera-green/20 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 dark:text-[#F0EAD6] text-[#36454F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-[#F0EAD6] text-[#36454F]">{benefit.title}</h4>
                    <p className="dark:text-[#E2DFD2] text-[#36454F] leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 dark:text-[#F0EAD6] text-[#36454F]">For Job Seekers</h3>
            <div className="space-y-8">
              {jobSeekerBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-testera-green/20 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 dark:text-[#F0EAD6] text-[#36454F]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-[#F0EAD6] text-[#36454F]">{benefit.title}</h4>
                    <p className="dark:text-[#E2DFD2] text-[#36454F] leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};