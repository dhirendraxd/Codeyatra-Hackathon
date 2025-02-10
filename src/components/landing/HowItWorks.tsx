import { FileText, Edit3, Share2, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Create Job Description and Assessment using AI",
    description: "Testera uses latest AI models to create job descriptions and tests which are specific to your industry and job type",
    icon: FileText,
    iconColor: "from-orange-400 to-red-500",
  },
  {
    number: "2",
    title: "Edit, Remove or Add Questions",
    description: "Choose from video, audio, descriptive, and MCQ questions types to assess candidates on hard and soft skills through diverse mediums",
    icon: Edit3,
    iconColor: "from-blue-400 to-purple-500",
  },
 
  {
    number: "3",
    title: "Review Results",
    description: "Testera AI evaluates, scores, and provides details feedback on each question for every candidate responses so you can skip to reviewing the best candidates.",
    icon: BarChart3,
    iconColor: "from-green-400 to-emerald-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Simple, 3 Step Process
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-[#F1F0FB] dark:bg-[#222222] border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white dark:bg-[#333333] shadow-lg flex items-center justify-center font-bold text-lg dark:text-[#F0EAD6] text-[#36454F]">
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.iconColor} flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.iconColor} opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-300`} />
                    <Icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold dark:text-[#F0EAD6] text-[#36454F] leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm dark:text-[#E2DFD2] text-[#36454F] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};