import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef } from "react";
import { useReveal } from "@/lib/gsap";

const FAQS = [
  { question: "Will this hurt my feelings?", answer: "Yes. Next question." },
  {
    question: "Is it really free?",
    answer: "We literally just told you it's $0. Are you a runner or a goldfish?",
  },
  {
    question: "Why are you so mean?",
    answer:
      "We're not mean, we're honest. Your pace chart is mean. We just point at it.",
  },
  {
    question: "Can I share this on Tinder?",
    answer:
      "You can, but 'I run 5ks in 45 minutes' might not be the flex you think it is.",
  },
  {
    question: "Do I need Strava?",
    answer:
      "Yes. We can't roast your imaginary runs. We need real data to make fun of.",
  },
  {
    question: "What if I'm actually fast?",
    answer: "Then we'll make fun of you for trying too hard. You can't win.",
  },
];

const FAQ = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <section ref={container} className="relative bg-black py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 md:mb-20">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF0066]"
          >
            / FAQ
          </span>
          <h2
            data-reveal
            className="mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full" data-reveal>
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-white/10"
            >
              <AccordionTrigger className="py-7 text-left font-grotesk text-xl uppercase tracking-tight text-white transition-colors hover:no-underline data-[state=open]:text-[#CCFF00] md:text-3xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-7 font-mono text-base leading-relaxed text-white/60 md:text-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
