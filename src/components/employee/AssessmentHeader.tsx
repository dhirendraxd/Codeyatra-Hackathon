
interface AssessmentHeaderProps {
  title: string;
  subtitle?: string; // Added subtitle as optional prop
}

export const AssessmentHeader = ({ title, subtitle }: AssessmentHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold dark:text-[#F9F6EE] text-[#36454F]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm md:text-base dark:text-[#E2DFD2] text-[#36454F]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
