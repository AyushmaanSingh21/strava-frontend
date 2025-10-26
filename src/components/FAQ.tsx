import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "WILL THIS ROAST HURT MY FEELINGS?",
      answer: "Yes ❤️ But it's constructive. Think tough coach, not internet troll. We keep it real but never cruel."
    },
    {
      question: "IS MY DATA SAFE?",
      answer: "Absolutely. We only access your public Strava data via official API. No shady business. Your stats stay yours."
    },
    {
      question: "WHY ISN'T THE ROAST FEATURE FREE?",
      answer: "AI costs money. Server costs money. Keeping this project alive costs money. We're not a charity, but we're fair."
    },
    {
      question: "CAN I CANCEL PREMIUM ANYTIME?",
      answer: "Yep. One click. No guilt trip emails. No 'are you sure?' loops. Clean break."
    },
    {
      question: "DO I NEED STRAVA?",
      answer: "Yes. We pull data from Strava's API. No Strava account = nothing to analyze = sad times."
    },
    {
      question: "WHAT ACTIVITIES DO YOU SUPPORT?",
      answer: "Everything Strava tracks. Running, cycling, swimming, hiking. If you logged it, we'll analyze it."
    },
    {
      question: "HOW ACCURATE ARE THE ROASTS?",
      answer: "Scary accurate. AI looks at pace consistency, elevation choices, rest days (or lack thereof). It knows."
    }
  ];
  
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-white font-heading text-7xl md:text-8xl text-center mb-16">
          REAL TALK
        </h2>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-t border-white/20 hover:border-l-4 hover:border-l-lime transition-all duration-200"
            >
              <AccordionTrigger className="text-white font-heading text-xl md:text-2xl py-6 hover:no-underline hover:text-lime">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/80 font-body text-base pb-6 leading-relaxed">
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
