import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const EmployeeHero = () => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 pt-24">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 dark:text-[#F9F6EE] text-[#36454F]">
          Give assessments and get hired fast
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Input 
              type="text"
              placeholder="Enter Location/Company/Role"
              className="w-full h-12 pl-12 bg-white dark:bg-gray-800 dark:text-[#E2DFD2] text-[#36454F] placeholder:text-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <select className="h-12 px-4 rounded-md border bg-white dark:bg-gray-800 dark:text-[#E2DFD2] text-[#36454F]">
            <option>Select experience</option>
            <option>0-2 years</option>
            <option>2-5 years</option>
            <option>5+ years</option>
          </select>
          
          <Button 
            className="h-12 px-8 bg-[#006BFF] hover:bg-[#0055CC] text-white font-semibold"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};