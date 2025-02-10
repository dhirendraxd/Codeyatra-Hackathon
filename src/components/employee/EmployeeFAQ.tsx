import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I start taking assessments?",
    answer: "Simply create an account, browse available job positions, and start taking assessments that match your skills and interests.",
  },
  {
    question: "Are the assessments timed?",
    answer: "Most assessments have a recommended time limit, but you can take them at your own pace to ensure the best results.",
  },
  {
    question: "How quickly will I hear back after completing an assessment?",
    answer: "Our AI provides instant feedback on your performance, and employers typically respond within 48-72 hours if they're interested.",
  },
  {
    question: "Can I retake an assessment if I'm not satisfied with my score?",
    answer: "Yes, you can retake assessments after a 24-hour cooling period to improve your score and showcase your best performance.",
  },
];

export const EmployeeFAQ = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="dark:text-[#F0EAD6] text-[#36454F]">{faq.question}</AccordionTrigger>
              <AccordionContent className="dark:text-[#E2DFD2] text-[#36454F]">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};