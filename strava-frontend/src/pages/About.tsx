import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Github, Linkedin, Mail, Twitter, Coffee, ExternalLink } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white font-fredoka selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-24 animate-fade-in-up">
          {/* Photo Placeholder */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-[#CCFF00] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white overflow-hidden relative z-10 shadow-[8px_8px_0_#CCFF00] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[4px_4px_0_#CCFF00] transition-all duration-300 bg-gray-800">
               {/* Replace this img src with your actual photo later */}
               <img 
                 src="https://github.com/shadcn.png" 
                 alt="Ayushmaan Singh" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
               />
            </div>
          </div>

          {/* Intro Text */}
          <div className="text-center md:text-left">
            <h1 className="font-bangers text-5xl md:text-7xl uppercase tracking-wide mb-6">
              Name's <span className="text-[#CCFF00]">Ayushmaan.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium max-w-2xl">
              I build systems. End to end. Front to back. Pixel to packet. 
              I architect chaos into clean design. I take broken ideas, gut them, and rebuild them stronger, faster, leaner.
            </p>
          </div>
        </div>

        {/* "Why This Website" Section */}
        <div className="mb-24 animate-fade-in-up delay-100">
          <div className="text-center mb-12">
            <span className="text-gray-500 font-bangers uppercase tracking-widest text-sm">Enough about me. Why this website?</span>
            <h2 className="font-bangers text-4xl md:text-6xl text-[#FF0066] mt-4 uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(255,0,102,0.3)]">
              You know the drill.
            </h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0066]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center font-medium">
              <span className="text-white font-bold">You run. You track. You forget.</span> <br/><br/>
              I didn't just want another dashboard. I wanted a story. 
              Strava gives you data; <span className="text-[#00F0FF]">RunWrapped</span> gives you a vibe. 
              I built this to tear down the walls between your sweat and your social feed. 
              It's not just code—it's your year in pixels.
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-200">
          
          {/* Social Links */}
          <div className="bg-black border-[3px] border-white rounded-3xl p-8 shadow-[8px_8px_0_#333] hover:shadow-[12px_12px_0_#333] transition-all duration-300 relative overflow-hidden">
            <h3 className="font-bangers text-3xl uppercase tracking-wide mb-8 flex items-center gap-3">
              Stalk Me <span className="text-gray-600 text-lg">(Professionally)</span>
            </h3>
            
            <div className="flex flex-col gap-4">
              <a href="https://www.strava.com/athletes/YOUR_STRAVA_ID" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-[#FC4C02]/20 border border-white/10 hover:border-[#FC4C02] transition-all group">
                <div className="bg-[#FC4C02] p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">Follow on Strava</span>
              </a>

              <a href="https://github.com/AyushmaanSingh21" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white transition-all group">
                <div className="bg-white text-black p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">Check Code</span>
              </a>

              <a href="https://twitter.com/YOUR_TWITTER" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/20 border border-white/10 hover:border-[#1DA1F2] transition-all group">
                <div className="bg-[#1DA1F2] p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5" />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">Twitter / X</span>
              </a>

              <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-[#0077B5]/20 border border-white/10 hover:border-[#0077B5] transition-all group">
                <div className="bg-[#0077B5] p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">LinkedIn</span>
              </a>
              
              <a href="mailto:your.email@example.com" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-[#CCFF00]/20 border border-white/10 hover:border-[#CCFF00] transition-all group">
                <div className="bg-[#CCFF00] p-2 rounded-lg text-black group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-bangers text-xl tracking-wide uppercase">Send Email</span>
              </a>
            </div>
          </div>

          {/* Support / Buy Me Coffee */}
          <div className="flex flex-col gap-8">
            <div className="bg-[#FFDD00] text-black border-[3px] border-white rounded-3xl p-8 shadow-[8px_8px_0_#fff] hover:shadow-[12px_12px_0_#fff] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="absolute top-4 right-4 opacity-20">
                  <Coffee className="w-24 h-24" />
                </div>
                <h3 className="font-bangers text-4xl uppercase tracking-wide mb-4 relative z-10">
                  Fuel the Code
                </h3>
                <p className="text-lg font-bold mb-8 relative z-10 leading-relaxed">
                  Servers aren't free, and neither is the caffeine required to fix bugs at 3 AM. 
                  If RunWrapped made you smile (or cry), consider buying me a coffee.
                </p>
              </div>
              
              <a 
                href="https://buymeacoffee.com/YOUR_USERNAME" /* <--- PASTE YOUR LINK HERE */
                target="_blank" 
                rel="noreferrer"
                className="bg-black text-white font-bangers text-2xl uppercase tracking-widest py-4 px-8 rounded-xl text-center hover:bg-gray-900 transition-colors border-2 border-transparent hover:border-white shadow-lg relative z-10 flex items-center justify-center gap-3"
              >
                <Coffee className="w-6 h-6" />
                Buy Me A Coffee
              </a>
            </div>

            {/* Tech Stack Mini-Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
               <h4 className="font-bangers text-xl uppercase tracking-wide text-gray-400 mb-4">Built With</h4>
               <div className="flex flex-wrap gap-2">
                 {['React', 'TypeScript', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Strava API'].map((tech) => (
                   <span key={tech} className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white border border-white/10">
                     {tech}
                   </span>
                 ))}
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
