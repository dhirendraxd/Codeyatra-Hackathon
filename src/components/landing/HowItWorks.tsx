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
    title: "Publish and Share the assessment",
    description: "Share assessments links privately to candidates or post your job on Testera's public job board to let anyone apply",
    icon: Share2,
    iconColor: "from-teal-400 to-emerald-500",
  },
  {
    number: "4",
    title: "Review Results",
    description: "Testera AI evaluates, scores, and provides details feedback on each question for every candidate responses so you can skip to reviewing the best candidates.",
    icon: BarChart3,
    iconColor: "from-green-400 to-emerald-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Simple, 4 Step Process
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-[#F1F0FB] dark:bg-[#222222] border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 group rounded-[24px] p-6"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-muted dark:text-[#F0EAD6] text-[#36454F] flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.iconColor} flex items-center justify-center relative`}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 blur-lg animate-pulse" style={{ background: `linear-gradient(135deg, ${step.iconColor})` }} />
                  <Icon className="w-8 h-8 text-background relative z-10" />
                </div>
                <h3 className="text-xl text-center mb-2 dark:text-[#F0EAD6] text-[#36454F]">
                  {step.title}
                </h3>
                <p className="dark:text-[#E2DFD2] text-[#36454F]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};