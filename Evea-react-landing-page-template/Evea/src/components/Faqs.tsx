import { LuChevronUp } from "react-icons/lu";
import { faqContents } from "./data";
import { cn } from "@/helper/cn";
import { useState } from "react";

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="py-20  bg-gray-50">
      <div className="container">
        <div className="">
          <div className="text-center max-w-xl mx-auto">
            <div>
              <span className="text-sm text-primary uppercase font-medium tracking-wider text-default-950 mb-6">
                FAQs
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl/tight font-semibold mt-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div
            id="accordion-collapse"
            data-accordion="collapse"
            className="md:gap-[30px] mt-14 bg-white rounded-xl"
          >
            <div className="hs-accordion-group divide-y divide-gray-200">
              <div className="relative overflow-hidden">
                <div className="hidden lg:block">
                  <div className="before:absolute before:-start-10 before:-top-10 before:-z-10 before:h-24 before:w-24 before:rotate-180 before:bg-[url('../images/landing/agency/dot.svg')] after:absolute after:-bottom-10 after:-end-10 after:-z-10 after:h-24 after:w-24 after:bg-[url('../images/landing/agency/dot.svg')]" />
                </div>

                <div className="grid grid-cols-1 items-center">
                  
                    <div className="hs-accordion-group divide-y divide-gray-200">
                      {faqContents.map((faq, idx) => {
                        return (
                          <div
                            key={`faq-${idx}`}
                            className={cn(
                              "relative overflow-hidden",
                              { active: activeIndex === idx }
                            )}
                          >
                            <button
                              className="inline-flex w-full items-center justify-between gap-x-3 px-6 py-4 text-left capitalize text-default-950 transition-all"
                              onClick={() => toggleAccordion(idx)}
                            >
                              <h2 className="text-base font-semibold">
                                {faq.title}
                              </h2>

                              <LuChevronUp
                                className={`h-4 w-4 transition-all duration-500 ${
                                  activeIndex === idx
                                    ? "-rotate-180"
                                    : "rotate-0"
                                }`}
                              />
                            </button>

                            <div
                              className={`w-full overflow-hidden transition-[height] duration-300
                          ${activeIndex === idx ? "" : "hidden"}`}
                            >
                              <div className="px-5 pb-5">
                                <p className="text-muted text-base font-normal">{faq.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
