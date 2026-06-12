import React from 'react';
import { FadeIn } from '../ui/FadeIn';

const services = [
  {
    num: "01",
    name: "Full Stack Dev",
    desc: "Creation of robust backend systems and dynamic frontend interfaces tailored to specific needs, ensuring scalability and performance."
  },
  {
    num: "02",
    name: "Clean Code",
    desc: "Writing maintainable, readable, and optimized code following SOLID principles, ensuring your team can easily scale."
  },
  {
    num: "03",
    name: "AI Integration",
    desc: "Leveraging Artificial Intelligence to optimize processes, enhance code quality, and provide innovative solutions."
  },
  {
    num: "04",
    name: "Database Architecture",
    desc: "Designing scalable SQL and NoSQL database schemas that handle complex relationships and large data volumes efficiently."
  },
  {
    num: "05",
    name: "UI/UX Focus",
    desc: "Designing clean, modern, and user-centric interfaces with attention to layout, interactions, and overall experience."
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10">
      <h2 className="font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28 leading-none">
        Services
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col">
        {services.map((svc, i) => (
          <FadeIn key={svc.num} delay={i * 0.1} y={30} className="border-b border-[rgba(12,12,12,0.15)] last:border-none">
            <div className="flex flex-col md:flex-row md:items-center py-8 sm:py-10 md:py-12">
              <div className="font-black text-[clamp(3rem,10vw,140px)] leading-none md:w-1/3 mb-4 md:mb-0">
                {svc.num}
              </div>
              <div className="md:w-2/3 flex flex-col justify-center">
                <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] mb-2 md:mb-4">
                  {svc.name}
                </h3>
                <p className="font-light leading-relaxed opacity-60 text-[clamp(0.85rem,1.6vw,1.25rem)] max-w-2xl">
                  {svc.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};
