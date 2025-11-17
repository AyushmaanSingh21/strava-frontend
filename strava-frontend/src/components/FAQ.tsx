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
    <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-blue-900/10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-display text-6xl md:text-8xl font-black mb-4 uppercase tracking-tight">
            QUESTIONS?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider">
            We got answers
          </p>
        </div>
        
        <Accordion type="single" collapsible className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b-2 border-gray-800 hover:border-[#CCFF00] transition-all duration-200 px-4"
            >
              <AccordionTrigger className="text-white font-display text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-[#CCFF00] uppercase">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 font-body text-base md:text-lg pb-6 leading-relaxed">
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
