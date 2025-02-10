
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for job seekers and basic assessments",
    features: [
      "Take up to 5 assessments per month",
      "Basic profile customization",
      "Access to public job listings",
      "Standard assessment feedback",
      "Email support"
    ],
    badge: null,
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    name: "Pro",
    price: "29",
    description: "For serious job seekers who want to stand out",
    features: [
      "Unlimited assessments",
      "Priority assessment review",
      "Advanced analytics and feedback",
      "Custom profile portfolio",
      "Practice assessments",
      "Priority email support",
      "AI-powered interview preparation",
      "Skills development roadmap"
    ],
    badge: "Most Popular",
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: "99",
    description: "For companies and professional recruiters",
    features: [
      "All Pro features",
      "Custom assessment creation",
      "Bulk assessment invitations",
      "Advanced candidate analytics",
      "Team collaboration tools",
      "API access",
      "Dedicated account manager",
      "Custom branding",
      "24/7 phone support"
    ],
    badge: "Best Value",
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

export const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-background" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-[#F9F6EE] text-[#36454F]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg dark:text-[#E2DFD2] text-[#36454F]">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className="relative flex flex-col border-2 hover:border-primary/50 transition-colors"
            >
              {plan.badge && (
                <Badge 
                  className="absolute -top-3 right-4 bg-primary"
                  variant="default"
                >
                  {plan.badge}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl dark:text-[#F9F6EE] text-[#36454F]">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold dark:text-[#F9F6EE] text-[#36454F]">${plan.price}</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm dark:text-[#E2DFD2] text-[#36454F]">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm dark:text-[#E2DFD2] text-[#36454F]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  asChild
                >
                  <Link to="/auth">
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
