import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { useEffect, useRef, useState } from "react";
import MusicPlayer from "./MusicPlayer";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface NavigationProps {
  autoPlayMusic?: boolean;
}

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
];

const Navigation = ({ autoPlayMusic = false }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profile = localStorage.getItem("strava_profile");
    if (profile) {
      try {
        setUserProfile(JSON.parse(profile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Scroll-aware bar: fades in a blurred backdrop after leaving the top.
  useGSAP(
    () => {
      gsap.set(".nav-backdrop", { autoAlpha: 0 });
      ScrollTrigger.create({
        start: "top -60",
        end: 99999,
        onToggle: (self) =>
          gsap.to(".nav-backdrop", {
            autoAlpha: self.isActive ? 1 : 0,
            duration: 0.35,
          }),
      });
    },
    { scope: bar }
  );

  // Animate the mobile overlay menu.
  useGSAP(
    () => {
      if (open) {
        gsap.set(overlay.current, { display: "flex" });
        gsap
          .timeline()
          .to(overlay.current, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
          .from(
            ".overlay-link",
            { y: 40, autoAlpha: 0, stagger: 0.07, duration: 0.5, ease: "power3.out" },
            "-=0.1"
          );
      } else {
        gsap.to(overlay.current, {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => gsap.set(overlay.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: overlay }
  );

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const Logo = () => (
    <button
      onClick={() => go("/")}
      className="font-grotesk text-white text-2xl md:text-3xl uppercase tracking-tight leading-none hover:opacity-80 transition-opacity"
    >
      RUNWR<span className="text-[#FFB84D]">▲</span>PPED
    </button>
  );

  return (
    <>
      <nav ref={bar} className="fixed top-0 left-0 right-0 z-50">
        {/* Backdrop that appears on scroll */}
        <div className="nav-backdrop absolute inset-0 bg-black/70 backdrop-blur-xl border-b border-white/10" />

        <div className="relative container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => go(link.path)}
                className={`font-grotesk uppercase text-sm tracking-widest transition-colors relative group ${
                  isActive(link.path) ? "text-[#FFB84D]" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-0.5 bg-[#FFB84D] transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 md:gap-4">
            <MusicPlayer autoPlay={autoPlayMusic} />

            {userProfile ? (
              <div className="hidden md:flex items-center gap-2.5 pl-1">
                <img
                  src={userProfile.profile}
                  alt={userProfile.firstname}
                  className="w-9 h-9 rounded-full border-2 border-[#FFB84D] object-cover"
                />
                <span className="font-grotesk uppercase text-white text-sm tracking-wide leading-none">
                  {userProfile.firstname}
                </span>
              </div>
            ) : (
              <button
                onClick={initiateStravaLogin}
                className="hidden md:inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-grotesk uppercase tracking-widest text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
              >
                Connect Strava
              </button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden text-white p-2"
              aria-label="Menu"
            >
              {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen mobile overlay */}
      <div
        ref={overlay}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-6 bg-black/95 backdrop-blur-2xl md:hidden"
        style={{ opacity: 0 }}
      >
        <div className="dot-grid absolute inset-0 opacity-30" />
        {LINKS.map((link) => (
          <button
            key={link.path}
            onClick={() => go(link.path)}
            className={`overlay-link relative font-grotesk uppercase text-5xl tracking-tight ${
              isActive(link.path) ? "text-[#FFB84D]" : "text-white"
            }`}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => {
            setOpen(false);
            initiateStravaLogin();
          }}
          className="overlay-link mt-4 bg-[#FC4C02] text-white font-grotesk uppercase tracking-widest text-lg px-8 py-4 rounded-full"
        >
          Connect Strava
        </button>
      </div>
    </>
  );
};

export default Navigation;
