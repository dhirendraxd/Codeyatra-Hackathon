import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Give Assessment",
    description: "Skip straight to assessment stage and show employers your excellent skills across MCQs, Descriptive, Audio, and Video formats. You can give as many assessments as you like!",
    icon: FileText,
    iconColor: "from-blue-400 to-purple-500",
  },
  {
    title: "Get Selected",
    description: "Testera AI reviews your answers and provides detailed feedback free from bias to ensure talent does not go unnoticed.",
    icon: CheckCircle,
    iconColor: "from-teal-400 to-emerald-500",
  },
];

export const EmployeeHowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Simple, 2 Step Process
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="relative bg-[#F1F0FB] dark:bg-[#222222] border-border text-card-foreground hover:shadow-xl transition-shadow duration-300 group rounded-[24px]"
              >
                <CardHeader className="pb-4">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-muted dark:text-[#F0EAD6] text-[#36454F] flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.iconColor} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 blur-lg animate-pulse" style={{ background: `linear-gradient(135deg, ${step.iconColor})` }} />
                    <Icon className="w-8 h-8 text-background relative z-10" />
                  </div>
                  <CardTitle className="text-xl text-center mb-2 dark:text-[#F0EAD6] text-[#36454F]">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="dark:text-[#E2DFD2] text-[#36454F] text-center">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};