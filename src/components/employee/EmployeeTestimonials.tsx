import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Thanks to Testera's AI assessments, I was able to showcase my real skills and land my dream job in tech!",
    author: "Michael R.",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    quote: "The practice assessments helped me understand exactly what employers were looking for. Great platform!",
    author: "Emily T.",
    role: "Data Analyst",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    quote: "I got multiple job offers within weeks of using Testera. The AI matching really works!",
    author: "James H.",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  },
  {
    quote: "The platform made it easy to demonstrate my skills to employers. Highly recommended!",
    author: "Lisa M.",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  },
  {
    quote: "Best career move I've made. The assessment process was smooth and effective.",
    author: "Chris P.",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
];

export const EmployeeTestimonials = () => {
  return (
    <section className="py-20 px-4 dark:bg-background bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          Success Stories from Job Seekers
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.author} className="pl-4 md:basis-1/3">
                <div className="h-full dark:bg-[#222222] bg-gray-50 p-8 rounded-[24px] border dark:border-white/10 border-gray-200">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex flex-col">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="font-semibold dark:text-[#F0EAD6] text-[#36454F]">
                        {testimonial.author}
                      </p>
                      <p className="dark:text-[#E2DFD2] text-[#36454F]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="dark:text-[#E2DFD2] text-[#36454F]">
                    {testimonial.quote}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};