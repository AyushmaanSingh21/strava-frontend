import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "WILL THIS HURT MY FEELINGS?",
      answer: "Yes. Next question."
    },
    {
      question: "IS IT REALLY FREE?",
      answer: "We literally just told you it's $0. Are you a runner or a goldfish?"
    },
    {
      question: "WHY ARE YOU SO MEAN?",
      answer: "We're not mean, we're honest. Your pace chart is mean. We just point at it."
    },
    {
      question: "CAN I SHARE THIS ON TINDER?",
      answer: "You can, but 'I run 5ks in 45 minutes' might not be the flex you think it is."
    },
    {
      question: "DO I NEED STRAVA?",
      answer: "Yes. We can't roast your imaginary runs. We need real data to make fun of."
    },
    {
      question: "WHAT IF I'M ACTUALLY FAST?",
      answer: "Then we'll make fun of you for trying too hard. You can't win."
    }
  ];
  
  return (
    <section className="py-24 bg-black border-b-[5px] border-white/20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-bangers text-6xl md:text-8xl mb-4 uppercase tracking-wide drop-shadow-[4px_4px_0_#000]">
            <span className="text-[#FF0066] drop-shadow-[4px_4px_0_#000]">QUESTIONS</span>
          </h2>
        </div>
        
        <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-black border-[3px] border-white rounded-2xl px-6 shadow-[4px_4px_0_#333] data-[state=open]:bg-[#CCFF00] data-[state=open]:border-[#CCFF00] data-[state=open]:shadow-[4px_4px_0_#fff] transition-all duration-200 group"
            >
              <AccordionTrigger className="text-white group-data-[state=open]:text-black font-bangers text-xl md:text-2xl tracking-wide py-6 hover:no-underline uppercase">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 group-data-[state=open]:text-black font-fredoka text-lg pb-6 leading-relaxed font-medium">
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
