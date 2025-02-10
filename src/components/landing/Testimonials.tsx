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
    quote: "Testera made finding my dream job so easy. I was able to take a test and apply to multiple jobs at once!",
    author: "Sarah L.",
    role: "Marketing Specialist",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
  },
  {
    quote: "As an employer, the AI-powered assessments saved me countless hours. The candidates we hired were exactly what we needed.",
    author: "Mark T.",
    role: "HR Manager",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    quote: "The platform's efficiency in matching candidates with the right positions is remarkable. Highly recommended!",
    author: "David K.",
    role: "Tech Recruiter",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
  },
  {
    quote: "Using Testera has transformed our hiring process. The quality of candidates has improved significantly.",
    author: "Jennifer P.",
    role: "COO",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
  },
  {
    quote: "The assessment tools are incredibly accurate. We've reduced our time-to-hire by 50%!",
    author: "Robert M.",
    role: "Hiring Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 dark:bg-background bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-[#F9F6EE] text-[#36454F]">
          What Our Users Are Saying About Testera
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
