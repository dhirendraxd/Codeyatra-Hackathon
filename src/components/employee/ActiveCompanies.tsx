import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const companies = [
  {
    name: "TechCorp Solutions",
    logo: "/placeholder.svg",
    location: "San Francisco, CA",
    industry: "Information Technology",
    activeAssessments: 12
  },
  {
    name: "InnovatePro",
    logo: "/placeholder.svg",
    location: "New York, NY",
    industry: "Software Development",
    activeAssessments: 8
  },
  {
    name: "DataSphere Analytics",
    logo: "/placeholder.svg",
    location: "Austin, TX",
    industry: "Data Analytics",
    activeAssessments: 15
  },
  {
    name: "CloudTech Systems",
    logo: "/placeholder.svg",
    location: "Seattle, WA",
    industry: "Cloud Computing",
    activeAssessments: 10
  },
  {
    name: "Digital Dynamics",
    logo: "/placeholder.svg",
    location: "Boston, MA",
    industry: "Digital Marketing",
    activeAssessments: 6
  },
  {
    name: "AI Solutions Inc",
    logo: "/placeholder.svg",
    location: "San Jose, CA",
    industry: "Artificial Intelligence",
    activeAssessments: 9
  },
  {
    name: "Cyber Security Pro",
    logo: "/placeholder.svg",
    location: "Washington, DC",
    industry: "Cybersecurity",
    activeAssessments: 11
  },
  {
    name: "FinTech Innovations",
    logo: "/placeholder.svg",
    location: "Chicago, IL",
    industry: "Financial Technology",
    activeAssessments: 7
  },
  {
    name: "BioTech Research",
    logo: "/placeholder.svg",
    location: "San Diego, CA",
    industry: "Biotechnology",
    activeAssessments: 13
  }
];

export const ActiveCompanies = () => {
  return (
    <div className="py-16 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 dark:text-[#F9F6EE] text-[#36454F] text-center">
        Active Companies
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {companies.map((company, index) => (
          <Card key={index} className="mx-2 cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <CardTitle className="text-xl dark:text-[#F9F6EE] text-[#36454F]">
                    {company.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm dark:text-[#E2DFD2] text-[#36454F] mt-1">
                    <MapPin size={16} />
                    <span>{company.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm dark:text-[#E2DFD2] text-[#36454F]">
                  <Briefcase size={16} />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium dark:text-[#F0EAD6] text-[#36454F]">
                  <Building2 size={16} />
                  <span>{company.activeAssessments} Active Assessments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link 
          to="/companies" 
          className="text-sm font-medium hover:underline dark:text-[#F0EAD6] text-[#36454F]"
        >
          Browse all companies
        </Link>
      </div>
    </div>
  );
};