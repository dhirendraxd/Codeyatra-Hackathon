import { EmployeeHero } from "@/components/employee/EmployeeHero";
import { ActiveCompanies } from "@/components/employee/ActiveCompanies";
import { ActiveAssessments } from "@/components/employee/ActiveAssessments";
import { EmployeeHowItWorks } from "@/components/employee/EmployeeHowItWorks";
import { EmployeeNavigation } from "@/components/employee/EmployeeNavigation";
import { EmployeeTestimonials } from "@/components/employee/EmployeeTestimonials";
import { EmployeeFAQ } from "@/components/employee/EmployeeFAQ";
import { Footer } from "@/components/landing/Footer";

const Employee = () => {
  return (
    <div className="min-h-screen bg-background">
      <EmployeeNavigation />
      <EmployeeHero />
      <ActiveAssessments />
      <ActiveCompanies />
      <EmployeeHowItWorks />
      <EmployeeTestimonials />
      <EmployeeFAQ />
      <Footer />
    </div>
  );
};

export default Employee;