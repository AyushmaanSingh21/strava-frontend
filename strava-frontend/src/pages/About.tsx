import Navigation from "@/components/Navigation";
import { Github, Linkedin, Mail, Twitter, Coffee, ExternalLink } from "lucide-react";
import { useRef } from "react";
import { useReveal } from "@/lib/gsap";

const SOCIALS = [
  {
    label: "Follow on Strava",
    href: "https://www.strava.com/athletes/168504644",
    icon: ExternalLink,
    accent: "#FC4C02",
  },
  {
    label: "Check the Code",
    href: "https://github.com/AyushmaanSingh21",
    icon: Github,
    accent: "#F2ECE1",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/AyuuSure",
    icon: Twitter,
    accent: "#4C6FFF",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayushmaansingh21/",
    icon: Linkedin,
    accent: "#8E7BE8",
  },
  {
    label: "Send Email",
    href: "mailto:singh.ayushmaan2721@gmail.com",
    icon: Mail,
    accent: "#FFB84D",
  },
];

const TECH = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind",
  "Node.js",
  "Express",
  "MongoDB",
  "Gemini AI",
  "Strava API",
];

const About = () => {
  const container = useRef<HTMLDivElement>(null);
  useReveal(container);

  return (
    <div
      ref={container}
      className="min-h-screen overflow-x-hidden bg-[#0B0910] font-mono text-[#F2ECE1] selection:bg-[#FFB84D] selection:text-black"
    >
      <Navigation />

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        {/* Intro */}
        <section className="mb-24 md:mb-32">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#FFB84D]"
          >
            / About the maker
          </span>

          <div className="mt-8 flex flex-col items-center gap-12 md:flex-row md:items-start">
            {/* Photo */}
            <div data-reveal className="relative shrink-0">
              <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(255,184,77,0.25),transparent_70%)] blur-2xl" />
              <div className="group relative z-10 h-44 w-44 overflow-hidden rounded-full border border-white/15 md:h-56 md:w-56">
                <img
                  src="https://github.com/shadcn.png"
                  alt="Ayushmaan Singh"
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
            </div>

            {/* Intro text */}
            <div className="text-center md:text-left">
              <h1
                data-reveal
                className="font-grotesk text-5xl uppercase leading-[0.85] tracking-tight text-white md:text-7xl"
              >
                Name's{" "}
                <span className="font-condiment lowercase tracking-normal text-[#FFB84D]">
                  Ayushmaan.
                </span>
              </h1>
              <p
                data-reveal
                className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
              >
                I build systems end to end, pixel to packet. Chaos in, clean architecture
                out. Genius, billionaire, engineer — minus the billionaire part (for now).
                I tear broken ideas apart and rebuild them stronger, faster, leaner.
              </p>
              <p
                data-reveal
                className="mt-4 font-grotesk text-lg uppercase tracking-wide text-white md:text-xl"
              >
                I wanted to see my running wrap so I just made one.
              </p>
            </div>
          </div>
        </section>

        {/* Why this website */}
        <section className="mb-24 md:mb-32">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#8E7BE8]"
          >
            / Enough about me — why this?
          </span>
          <h2
            data-reveal
            className="mt-4 font-grotesk text-4xl uppercase leading-[0.9] tracking-tight text-white md:text-6xl"
          >
            You know{" "}
            <span className="font-condiment lowercase tracking-normal text-[#8E7BE8]">
              the drill.
            </span>
          </h2>

          <div
            data-reveal
            className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12"
          >
            <p className="text-lg leading-relaxed text-white/75 md:text-xl">
              <span className="font-grotesk uppercase tracking-wide text-white">
                You run. You track. You forget.
              </span>
              <br />
              <br />
              I didn't just want another dashboard. I wanted a story. Strava gives you data;{" "}
              <span className="text-[#4C6FFF]">RunWrapped</span> gives you a vibe. I built this
              to tear down the walls between your sweat and your social feed. It's not just
              code — it's your year in pixels.
            </p>
          </div>
        </section>

        {/* Connect */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Socials */}
          <div
            data-reveal
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
          >
            <h3 className="mb-8 font-grotesk text-2xl uppercase tracking-tight text-white">
              Stalk me{" "}
              <span className="font-mono text-sm normal-case tracking-normal text-white/40">
                (professionally)
              </span>
            </h3>

            <div className="flex flex-col gap-3">
              {SOCIALS.map(({ label, href, icon: Icon, accent }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-white/25"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-black transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-grotesk text-lg uppercase tracking-wide text-white">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Coffee + tech */}
          <div className="flex flex-col gap-8">
            <div
              data-reveal
              className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#FFB84D]/40 bg-[#FFB84D]/10 p-8"
            >
              <div className="pointer-events-none absolute right-4 top-4 opacity-10">
                <Coffee className="h-24 w-24 text-[#FFB84D]" />
              </div>
              <div className="relative z-10">
                <h3 className="mb-4 font-grotesk text-3xl uppercase tracking-tight text-[#FFB84D]">
                  Fuel the code
                </h3>
                <p className="mb-8 leading-relaxed text-white/75">
                  Servers aren't free, and neither is the caffeine required to fix bugs at 3
                  AM. If RunWrapped made you smile (or cry), consider buying me a coffee.
                </p>
              </div>
              <a
                href="https://buymeacoffee.com/YOUR_USERNAME"
                target="_blank"
                rel="noreferrer"
                className="relative z-10 flex items-center justify-center gap-3 rounded-full bg-[#FFB84D] py-4 font-grotesk text-lg uppercase tracking-widest text-black transition-all hover:-translate-y-0.5"
              >
                <Coffee className="h-5 w-5" />
                Buy Me A Coffee
              </a>
            </div>

            {/* Tech stack */}
            <div
              data-reveal
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-8"
            >
              <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                Built with
              </h4>
              <div className="flex flex-wrap gap-2">
                {TECH.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
