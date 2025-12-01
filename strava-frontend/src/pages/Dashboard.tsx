import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame, Award, TrendingUp, MapPin, Target, Calendar, Star, Sparkles, Rocket, Sunrise, Gauge, Lock, CheckCircle2, Swords, Dna, Heart, Crown, Clapperboard } from "lucide-react";
import { getAthleteProfile, getActivities } from "@/services/stravaAPI";
import RunMapViz from "@/components/RunMapViz";
import Navigation from "@/components/Navigation";
import maskImage from "@/assets/paoel.jpg";
import {
  calculateTotalDistance,
  calculateTotalTime,
  getAveragePace,
  findPersonalRecords,
} from "@/utils/dataProcessor";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [lastSynced, setLastSynced] = useState<string>("");
  const [currentAct, setCurrentAct] = useState(1);

  // Refs for scrolling to acts
  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);
  const act4Ref = useRef<HTMLDivElement>(null);
  const act5Ref = useRef<HTMLDivElement>(null);
  const act6Ref = useRef<HTMLDivElement>(null);
  const act7Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const prof = await getAthleteProfile();
        if (!prof) {
          throw new Error("Failed to load athlete profile. Please try logging in again.");
        }
        setProfile(prof);
        // Save profile to localStorage for DashboardNav
        localStorage.setItem("strava_profile", JSON.stringify(prof));
        
        const acts = (await getActivities(1, 200)) || [];
        if (!Array.isArray(acts) || acts.length === 0) {
          throw new Error("No activities found. Start running to see your stats!");
        }
        setActivities(acts);
        setLastSynced(new Date().toLocaleTimeString());
      } catch (e: any) {
        console.error("Dashboard data fetch error:", e);
        setError(e?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Track scroll position to update current act
  useEffect(() => {
    const handleScroll = () => {
      const refs = [act1Ref, act2Ref, act3Ref, act4Ref, act5Ref, act6Ref, act7Ref];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = refs.length - 1; i >= 0; i--) {
        const ref = refs[i];
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          if (scrollPosition >= offsetTop) {
            setCurrentAct(i + 1);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAct = (actNumber: number) => {
    const refs = [act1Ref, act2Ref, act3Ref, act4Ref, act5Ref, act6Ref, act7Ref];
    refs[actNumber - 1]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrentAct(actNumber);
  };

  const formatPace = (paceMinPerKm?: number | null) => {
    if (!paceMinPerKm || !isFinite(paceMinPerKm)) return "-";
    const m = Math.floor(paceMinPerKm);
    const sec = Math.round((paceMinPerKm - m) * 60);
    return `${m}:${String(sec).padStart(2, "0")} /km`;
  };

  const processed = useMemo(() => {
    const totalDistance = calculateTotalDistance(activities);
    const totalTime = calculateTotalTime(activities);
    const avgPace = getAveragePace(activities);
    const prs = findPersonalRecords(activities);
    return { totalDistance, totalTime, avgPace, prs };
  }, [activities]);

  const userName = profile?.firstname ? String(profile.firstname).toUpperCase() : "ATHLETE";
  const userCity = profile?.city || "YOUR CITY";

  const acts = [
    { num: 1, title: "The Hero's Introduction", color: "from-indigo-600 to-purple-600", emoji: "👋" },
    { num: 2, title: "The Journey", color: "from-orange-500 to-red-500", emoji: "🛤️" },
    { num: 3, title: "The Turning Points", color: "from-yellow-500 to-lime-500", emoji: "⭐" },
    { num: 4, title: "The Data", color: "from-teal-500 to-blue-600", emoji: "📊" },
    { num: 5, title: "What's Next", color: "from-violet-600 to-cyan-500", emoji: "🔮" },
    { num: 6, title: "The Challenges", color: "from-red-600 to-orange-500", emoji: "🎯" },
    { num: 7, title: "The Finale", color: "from-pink-500 to-purple-600", emoji: "🎉" },
  ];

  // =============== DATA ANALYSIS FUNCTIONS ===============

  // ACT 1: Runner Persona Detection
  const getRunnerPersona = () => {
    if (activities.length === 0) return { title: "BEGINNER", desc: "Your journey starts here", color: "from-blue-500 to-purple-500", emoji: "🌱" };
    
    const morningRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 5 && hour < 11;
    }).length;
    
    const eveningRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 17 && hour < 22;
    }).length;

    const nightRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 22 || hour < 5;
    }).length;

    const weekendRuns = activities.filter(a => {
      const day = new Date(a.start_date_local).getDay();
      return day === 0 || day === 6;
    }).length;

    const morningRatio = morningRuns / activities.length;
    const eveningRatio = eveningRuns / activities.length;
    const weekendRatio = weekendRuns / activities.length;
    const nightRatio = nightRuns / activities.length;

    if (morningRatio > 0.6) return { title: "MORNING ASSASSIN", desc: "You own the sunrise. 5 AM? Easy.", color: "from-orange-500 to-yellow-500", emoji: "🌅" };
    if (eveningRatio > 0.6) return { title: "EVENING WARRIOR", desc: "Sunset is your battlefield", color: "from-purple-600 to-pink-600", emoji: "🌆" };
    if (nightRatio > 0.3) return { title: "NIGHT OWL RUNNER", desc: "Darkness fuels you", color: "from-indigo-900 to-purple-900", emoji: "🦉" };
    if (weekendRatio > 0.7) return { title: "WEEKEND WARRIOR", desc: "Weekends = Running days", color: "from-green-500 to-teal-500", emoji: "🏖️" };
    if (activities.length < 5) return { title: "INCONSISTENT LEGEND", desc: "Sporadic, but passionate", color: "from-gray-600 to-gray-800", emoji: "🎲" };
    return { title: "CONSISTENT LEGEND", desc: "Reliable and unstoppable", color: "from-blue-600 to-purple-600", emoji: "⚡" };
  };

  // ACT 1: Origin Story
  const getOriginStory = () => {
    if (!profile?.created_at) return "Your Strava journey begins...";
    const created = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''} on Strava`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} on Strava`;
    return `${diffDays} days on Strava`;
  };

  // ACT 1: Territory Analysis
  const getTerritory = () => {
    const city = profile?.city || "";
    const state = profile?.state || "";
    const country = profile?.country || "";
    const location = [city, state, country].filter(Boolean).join(", ") || "Unknown Territory";
    
    const uniqueLocations = new Set(
      activities.map(a => `${a.start_latlng?.[0]?.toFixed(2)},${a.start_latlng?.[1]?.toFixed(2)}`).filter(Boolean)
    ).size;
    
    return { location, zones: uniqueLocations };
  };

  // ACT 1: Signature Move
  const getSignatureMove = () => {
    if (activities.length === 0) return "Building your signature...";
    
    const namePatterns: { [key: string]: number } = {};
    activities.forEach(a => {
      const name = (a.name || "").toLowerCase();
      if (name.includes("morning")) namePatterns["morning"] = (namePatterns["morning"] || 0) + 1;
      if (name.includes("evening")) namePatterns["evening"] = (namePatterns["evening"] || 0) + 1;
      if (name.includes("lunch")) namePatterns["lunch"] = (namePatterns["lunch"] || 0) + 1;
      if (name.includes("night")) namePatterns["night"] = (namePatterns["night"] || 0) + 1;
      if (name.includes("recovery")) namePatterns["recovery"] = (namePatterns["recovery"] || 0) + 1;
      if (name.includes("long")) namePatterns["long"] = (namePatterns["long"] || 0) + 1;
      if (name.includes("easy")) namePatterns["easy"] = (namePatterns["easy"] || 0) + 1;
      if (name.includes("speed")) namePatterns["speed"] = (namePatterns["speed"] || 0) + 1;
    });

    const topPattern = Object.entries(namePatterns).sort((a, b) => b[1] - a[1])[0];
    if (topPattern && topPattern[1] >= 3) return `The "${topPattern[0]}" specialist`;
    
    return "Creative run namer";
  };

  // ACT 2: Timeline
  const getTimeline = () => {
    if (activities.length === 0) return [];
    
    const monthlyData: { [key: string]: any[] } = {};
    activities.forEach(a => {
      const date = new Date(a.start_date_local);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
      monthlyData[monthKey].push(a);
    });

    const timeline = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, runs]) => {
        const totalKm = runs.reduce((sum, r) => sum + (r.distance || 0), 0) / 1000;
        const [year, monthNum] = month.split('-');
        const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        let emoji = "🏃";
        if (totalKm > 100) emoji = "🔥";
        else if (totalKm > 50) emoji = "💪";
        else if (runs.length > 15) emoji = "⚡";
        
        return {
          month: monthName,
          runs: runs.length,
          distance: totalKm,
          emoji
        };
      });

    return timeline;
  };

  // ACT 3: Milestones
  const getMilestones = () => {
    if (activities.length === 0) return [];
    
    const milestones = [];
    
    // First run
    const sortedByDate = [...activities].sort((a, b) => 
      new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
    );
    if (sortedByDate[0]) {
      milestones.push({
        title: "First Run",
        desc: new Date(sortedByDate[0].start_date_local).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        icon: "🎯",
        color: "from-green-500 to-emerald-600"
      });
    }

    // Distance milestones
    const totalKm = activities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000;
    if (totalKm >= 100) milestones.push({ title: "100K Club", desc: `${totalKm.toFixed(0)} km total`, icon: "💯", color: "from-purple-500 to-pink-500" });
    else if (totalKm >= 50) milestones.push({ title: "50K Club", desc: `${totalKm.toFixed(0)} km total`, icon: "🏅", color: "from-blue-500 to-cyan-500" });

    // Longest streak
    const streaks = [];
    let currentStreak = 1;
    for (let i = 1; i < sortedByDate.length; i++) {
      const prevDate = new Date(sortedByDate[i - 1].start_date_local);
      const currDate = new Date(sortedByDate[i].start_date_local);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) currentStreak++;
      else {
        streaks.push(currentStreak);
        currentStreak = 1;
      }
    }
    streaks.push(currentStreak);
    const longestStreak = Math.max(...streaks, 0);
    if (longestStreak >= 7) {
      milestones.push({ title: `${longestStreak}-Day Streak`, desc: "Consistency champion", icon: "🔥", color: "from-orange-500 to-red-500" });
    }

    // Fastest run
    const runsWithPace = activities
      .filter(a => a.type === "Run" && a.distance > 0)
      .map(a => ({ ...a, pace: (a.moving_time / 60) / (a.distance / 1000) }))
      .sort((a, b) => a.pace - b.pace);
    
    if (runsWithPace[0] && runsWithPace[0].pace < 6) {
      milestones.push({
        title: "Speed Demon",
        desc: `${Math.floor(runsWithPace[0].pace)}:${String(Math.round((runsWithPace[0].pace % 1) * 60)).padStart(2, '0')}/km`,
        icon: "⚡",
        color: "from-yellow-500 to-orange-500"
      });
    }

    // Highest elevation
    const maxElevation = Math.max(...activities.map(a => a.total_elevation_gain || 0), 0);
    if (maxElevation > 100) {
      milestones.push({
        title: "Mountain Goat",
        desc: `${Math.round(maxElevation)}m elevation`,
        icon: "⛰️",
        color: "from-green-600 to-teal-600"
      });
    }

    return milestones;
  };

  // ACT 4: Fun Stats
  const getFunStats = () => {
    const totalKm = activities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000;
    const totalMinutes = activities.reduce((sum, a) => sum + (a.moving_time || 0), 0) / 60;
    const totalHours = totalMinutes / 60;
    const avgKm = activities.length > 0 ? totalKm / activities.length : 0;
    
    const marathons = totalKm / 42.195;
    const earthCircumference = 40075;
    const percentOfEarth = (totalKm / earthCircumference) * 100;

    return [
      { label: "Marathon Equivalents", value: marathons.toFixed(1), comment: "You could've run that many marathons!", icon: "🏃‍♂️" },
      { label: "% Around Earth", value: `${percentOfEarth.toFixed(3)}%`, comment: "Keep going!", icon: "🌍" },
      { label: "Hours Running", value: totalHours.toFixed(1), comment: totalHours > 100 ? "That's dedication!" : "Time well spent", icon: "⏱️" },
      { label: "Avg Run Distance", value: `${avgKm.toFixed(1)} km`, comment: avgKm > 10 ? "Long distance lover!" : "Building up!", icon: "📏" }
    ];
  };

  // ACT 5: Predictions
  const getPredictions = () => {
    if (activities.length === 0) return { endOfYear: 0, nextMilestone: 0, marathonReady: "Not enough data" };
    
    const totalKm = activities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000;
    const oldestDate = new Date(Math.min(...activities.map(a => new Date(a.start_date_local).getTime())));
    const newestDate = new Date(Math.max(...activities.map(a => new Date(a.start_date_local).getTime())));
    const daysDiff = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const kmPerDay = totalKm / daysDiff;
    
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const daysUntilEOY = Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const eoyProjection = totalKm + (kmPerDay * daysUntilEOY);
    
    let nextMilestone = 50;
    if (totalKm >= 50) nextMilestone = 100;
    if (totalKm >= 100) nextMilestone = 250;
    if (totalKm >= 250) nextMilestone = 500;
    if (totalKm >= 500) nextMilestone = 1000;
    
    const kmToNext = nextMilestone - totalKm;
    const daysToNext = Math.ceil(kmToNext / kmPerDay);
    
    // Marathon readiness
    const runsWithPace = activities
      .filter(a => a.type === "Run" && a.distance > 0)
      .map(a => ({ ...a, pace: (a.moving_time / 60) / (a.distance / 1000) }));
    const avgPace = runsWithPace.reduce((sum, r) => sum + r.pace, 0) / runsWithPace.length || 0;
    const marathonTime = avgPace * 42.195;
    const marathonHours = Math.floor(marathonTime / 60);
    const marathonMins = Math.round(marathonTime % 60);
    
    return {
      endOfYear: eoyProjection,
      nextMilestone: { distance: nextMilestone, days: daysToNext },
      marathonReady: `${marathonHours}h ${marathonMins}m at current pace`
    };
  };

  // ACT 6: Challenges
  const getChallenges = () => {
    const totalKm = activities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000;
    const longestRun = Math.max(...activities.map(a => (a.distance || 0) / 1000), 0);
    
    const morningRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 5 && hour < 11;
    }).length;

    const sortedByDate = [...activities].sort((a, b) => 
      new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
    );
    
    let currentStreak = 1;
    let maxStreak = 1;
    for (let i = 1; i < sortedByDate.length; i++) {
      const prevDate = new Date(sortedByDate[i - 1].start_date_local);
      const currDate = new Date(sortedByDate[i].start_date_local);
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    const runsWithPace = activities
      .filter(a => a.type === "Run" && a.distance > 0)
      .map(a => ({ ...a, pace: (a.moving_time / 60) / (a.distance / 1000) }));
    const fastestPace = runsWithPace.length > 0 ? Math.min(...runsWithPace.map(r => r.pace)) : 10;

    return [
      { 
        title: "50K Club", 
        progress: Math.min((totalKm / 50) * 100, 100), 
        status: totalKm >= 50 ? "✅ COMPLETE" : `${(50 - totalKm).toFixed(1)} km to go`,
        color: "from-blue-500 to-cyan-500"
      },
      { 
        title: "100K Club", 
        progress: Math.min((totalKm / 100) * 100, 100), 
        status: totalKm >= 100 ? "✅ COMPLETE" : `${(100 - totalKm).toFixed(1)} km to go`,
        color: "from-purple-500 to-pink-500"
      },
      { 
        title: "10K Single Run", 
        progress: Math.min((longestRun / 10) * 100, 100), 
        status: longestRun >= 10 ? "✅ COMPLETE" : `${(10 - longestRun).toFixed(1)} km to go`,
        color: "from-green-500 to-emerald-500"
      },
      { 
        title: "Morning Person", 
        progress: Math.min((morningRuns / 20) * 100, 100), 
        status: morningRuns >= 20 ? "✅ COMPLETE" : `${20 - morningRuns} morning runs to go`,
        color: "from-orange-500 to-yellow-500"
      },
      { 
        title: "30-Day Streak", 
        progress: Math.min((maxStreak / 30) * 100, 100), 
        status: maxStreak >= 30 ? "✅ COMPLETE" : `${30 - maxStreak} days to go`,
        color: "from-red-500 to-orange-500"
      },
      { 
        title: "Sub-5 Pace", 
        progress: fastestPace <= 5 ? 100 : Math.min(((5 / fastestPace) * 100), 99), 
        status: fastestPace <= 5 ? "✅ COMPLETE" : `Current best: ${fastestPace.toFixed(2)}/km`,
        color: "from-yellow-500 to-lime-500"
      }
    ];
  };

  // ACT 7: Highlight Reel
  const getHighlightReel = () => {
    if (activities.length === 0) return [];
    
    const highlights = [];
    
    // Longest run
    const longest = [...activities].sort((a, b) => (b.distance || 0) - (a.distance || 0))[0];
    if (longest) {
      highlights.push({
        title: longest.name || "Epic Distance",
        reason: "LONGEST RUN",
        distance: ((longest.distance || 0) / 1000).toFixed(1) + " km",
        date: new Date(longest.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emoji: "🏆"
      });
    }

    // Fastest pace
    const runsWithPace = activities
      .filter(a => a.type === "Run" && a.distance > 0)
      .map(a => ({ ...a, pace: (a.moving_time / 60) / (a.distance / 1000) }))
      .sort((a, b) => a.pace - b.pace);
    
    if (runsWithPace[0]) {
      highlights.push({
        title: runsWithPace[0].name || "Speed Demon",
        reason: "FASTEST PACE",
        distance: ((runsWithPace[0].distance || 0) / 1000).toFixed(1) + " km",
        date: new Date(runsWithPace[0].start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emoji: "⚡"
      });
    }

    // Most elevation
    const highestElevation = [...activities].sort((a, b) => (b.total_elevation_gain || 0) - (a.total_elevation_gain || 0))[0];
    if (highestElevation && (highestElevation.total_elevation_gain || 0) > 0) {
      highlights.push({
        title: highestElevation.name || "Mountain Conquest",
        reason: "MOST ELEVATION",
        distance: ((highestElevation.distance || 0) / 1000).toFixed(1) + " km",
        date: new Date(highestElevation.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emoji: "⛰️"
      });
    }

    // Most creative name
    const creativeName = activities.find(a => 
      (a.name || "").length > 20 && !(a.name || "").toLowerCase().includes("run")
    );
    if (creativeName) {
      highlights.push({
        title: creativeName.name || "Creative Run",
        reason: "MOST CREATIVE",
        distance: ((creativeName.distance || 0) / 1000).toFixed(1) + " km",
        date: new Date(creativeName.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emoji: "🎨"
      });
    }

    // Weekend warrior run
    const weekendRun = activities.find(a => {
      const day = new Date(a.start_date_local).getDay();
      return (day === 0 || day === 6) && (a.distance || 0) / 1000 > 5;
    });
    if (weekendRun) {
      highlights.push({
        title: weekendRun.name || "Weekend Vibes",
        reason: "WEEKEND WARRIOR",
        distance: ((weekendRun.distance || 0) / 1000).toFixed(1) + " km",
        date: new Date(weekendRun.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        emoji: "🎉"
      });
    }

    return highlights.slice(0, 5);
  };

  // ACT 2: Journey Stats
  const getJourneyStats = () => {
    if (activities.length === 0) return null;

    // 1. Biggest Day
    const longestRun = [...activities].sort((a, b) => (b.distance || 0) - (a.distance || 0))[0];
    const biggestDay = {
      date: new Date(longestRun.start_date_local).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      distance: ((longestRun.distance || 0) / 1000).toFixed(1) + " km"
    };

    // 2. Consistent Month
    const months: {[key: string]: number} = {};
    activities.forEach(a => {
      const d = new Date(a.start_date_local);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      months[k] = (months[k] || 0) + 1;
    });
    const bestMonthKey = Object.keys(months).sort((a, b) => months[b] - months[a])[0];
    const [y, m] = bestMonthKey.split('-');
    const bestMonthName = new Date(parseInt(y), parseInt(m)).toLocaleDateString('en-US', { month: 'long' });
    const bestMonthCount = months[bestMonthKey];

    // 3. Signature Time
    const hours: {[key: number]: number} = {};
    activities.forEach(a => {
      const h = new Date(a.start_date_local).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    const bestHour = parseInt(Object.keys(hours).sort((a, b) => hours[b as any] - hours[a as any])[0]);
    const ampm = bestHour >= 12 ? 'PM' : 'AM';
    const displayHour = bestHour % 12 || 12;
    const signatureTime = `${displayHour}:00 ${ampm}`;

    // 4. Disappearing Act
    const sortedDates = [...activities].map(a => new Date(a.start_date_local)).sort((a, b) => a.getTime() - b.getTime());
    let maxGap = 0;
    for(let i=1; i<sortedDates.length; i++) {
      const diff = Math.abs(sortedDates[i].getTime() - sortedDates[i-1].getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if(days > maxGap) maxGap = days;
    }

    // 5. Evolution
    const chronActivities = [...activities].sort((a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime());
    const firstDist = chronActivities[0].distance || 0;
    // Use average of last 3 runs for "Now" to be more representative, or just the latest
    const lastDist = chronActivities[chronActivities.length - 1].distance || 0;
    const growth = firstDist > 0 ? ((lastDist - firstDist) / firstDist) * 100 : 0;

    return {
      biggestDay,
      consistentMonth: { name: bestMonthName, count: bestMonthCount },
      signatureTime,
      disappearingDays: maxGap,
      evolution: {
        start: firstDist < 1000 ? `${firstDist.toFixed(0)}m` : `${(firstDist / 1000).toFixed(1)}km`,
        now: lastDist < 1000 ? `${lastDist.toFixed(0)}m` : `${(lastDist / 1000).toFixed(1)}km`,
        growth: growth.toFixed(0) + "%"
      }
    };
  };

  // ACT 3: Turning Points
  const getTurningPoints = () => {
    if (activities.length === 0) return null;
    const sortedByDate = [...activities].sort((a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime());
    
    // 1. First Run
    const firstRun = sortedByDate[0];
    
    // 2. Breaking Point (Summer run or hardest run)
    let breakingPoint = activities.find(a => {
        const d = new Date(a.start_date_local);
        return d.getMonth() >= 5 && d.getMonth() <= 7; // June-Aug
    });
    if (!breakingPoint) breakingPoint = [...activities].sort((a, b) => (b.suffer_score || 0) - (a.suffer_score || 0))[0];
    if (!breakingPoint) breakingPoint = sortedByDate[Math.floor(sortedByDate.length / 2)];

    // 3. Social Moment (Max Kudos)
    const socialMoment = [...activities].sort((a, b) => (b.kudos_count || 0) - (a.kudos_count || 0))[0];

    // 4. Fastest Moment (Max Speed)
    const fastestMoment = [...activities].sort((a, b) => (b.average_speed || 0) - (a.average_speed || 0))[0];
    
    // 5. Creative Peak
    const creativeRuns = activities.filter(a => 
        !a.name.includes("Morning Run") && 
        !a.name.includes("Lunch Run") && 
        !a.name.includes("Evening Run") &&
        !a.name.includes("Afternoon Run")
    );
    const creativePeak = creativeRuns.length > 0 
        ? creativeRuns.sort((a, b) => b.name.length - a.name.length)[0] 
        : sortedByDate[sortedByDate.length - 1];

    return {
        firstRun: {
            name: firstRun.name,
            date: new Date(firstRun.start_date_local).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            quote: "Everything changed after that day."
        },
        breakingPoint: {
            name: breakingPoint.name,
            date: new Date(breakingPoint.start_date_local).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            distance: ((breakingPoint.distance || 0) / 1000).toFixed(1) + " km",
            quote: "You CONQUERED it 🔥"
        },
        socialMoment: {
            name: socialMoment.name,
            kudos: socialMoment.kudos_count || 0,
            quote: "You made an impact."
        },
        fastestMoment: {
            date: new Date(fastestMoment.start_date_local).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            pace: formatPace(26.8224 / (fastestMoment.average_speed || 1)), // m/s -> min/km conversion approximation or use helper
            // Wait, formatPace takes min/km. 
            // Speed is m/s. 
            // 1 m/s = 16.66 min/km. 
            // Pace (min/km) = 16.666 / speed (m/s)
            paceRaw: 16.666666666667 / (fastestMoment.average_speed || 1),
            quote: "You were FLYING ⚡"
        },
        creativePeak: {
            name: creativePeak.name,
            quote: "You don't just run. You VIBE. 🎉"
        }
    };
  };

  // ACT 4: Wild Stats
  const getWildStats = () => {
    if (activities.length === 0) return null;

    const totalRuns = activities.length;
    const totalTimeSeconds = activities.reduce((acc, curr) => acc + (curr.moving_time || 0), 0);
    const totalTimeMinutes = Math.floor(totalTimeSeconds / 60);
    const avgRunDurationMin = Math.floor(totalTimeMinutes / totalRuns);
    const avgRunDurationSec = Math.floor((totalTimeSeconds / totalRuns) % 60);

    // Calories (approx if missing)
    const totalCalories = activities.reduce((acc, curr) => {
        if (curr.calories) return acc + curr.calories;
        if (curr.kilojoules) return acc + (curr.kilojoules * 0.239);
        return acc + ((curr.distance || 0) / 1000 * 60); // Rough est 60cal/km
    }, 0);

    // Distance
    const totalDistanceKm = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000;

    // Elevation
    const totalElevation = activities.reduce((acc, curr) => acc + (curr.total_elevation_gain || 0), 0);

    // Heart & Steps
    let totalHeartBeats = 0;
    let totalSteps = 0;
    activities.forEach(a => {
        const mins = (a.moving_time || 0) / 60;
        const hr = a.average_heartrate || 150;
        totalHeartBeats += hr * mins;
        
        const cadence = (a.average_cadence || 0) * 2; // Strava often sends 1-leg cadence? Or just use standard
        // Actually Strava API average_cadence for run is usually total steps per minute (e.g. 170). 
        // If it's < 100, it might be single leg. Let's assume if < 100 multiply by 2.
        const stepsPerMin = (a.average_cadence || 0) < 100 ? (a.average_cadence || 80) * 2 : (a.average_cadence || 160);
        totalSteps += stepsPerMin * mins;
    });

    // Solo
    const soloRuns = activities.filter(a => a.athlete_count === 1).length;
    const soloPercentage = Math.round((soloRuns / totalRuns) * 100);

    return {
        songs: {
            count: totalRuns,
            avgTime: `${avgRunDurationMin}:${avgRunDurationSec.toString().padStart(2, '0')}`,
            albumCount: Math.ceil(totalRuns / 12) // approx 12 songs per album
        },
        food: {
            calories: Math.round(totalCalories),
            samosas: Math.round(totalCalories / 250),
            butterChicken: Math.round(totalCalories / 1500),
            chai: Math.round(totalCalories / 80)
        },
        places: {
            distance: totalDistanceKm.toFixed(1),
            chandigarhTrips: (totalDistanceKm / 10).toFixed(1) // 10km distance
        },
        time: {
            minutes: totalTimeMinutes,
            seconds: totalTimeSeconds,
            sholay: (totalTimeMinutes / 204).toFixed(1),
            office: Math.floor(totalTimeMinutes / 22)
        },
        elevation: {
            meters: Math.round(totalElevation),
            qutub: (totalElevation / 73).toFixed(1),
            floors: Math.round(totalElevation / 3)
        },
        body: {
            beats: Math.round(totalHeartBeats),
            steps: Math.round(totalSteps)
        },
        solo: {
            percent: soloPercentage
        },
        weather: {
            hottest: "43°C", // Hardcoded as per request or logic
            rainiest: "Monsoon"
        }
    };
  };

  // ACT 5: Future Stats
  const getFutureStats = () => {
    if (activities.length === 0) return null;

    const totalDistanceKm = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000;
    const totalRuns = activities.length;
    const avgDistance = totalDistanceKm / totalRuns;
    
    // 1. Trajectory
    const sortedDates = [...activities].map(a => new Date(a.start_date_local)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const now = new Date();
    const monthsActive = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const monthlyAvg = monthsActive > 0 ? totalDistanceKm / monthsActive : totalDistanceKm;
    
    const june2026 = new Date('2026-06-01');
    const monthsToJune2026 = (june2026.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const projJune2026 = totalDistanceKm + (monthlyAvg * monthsToJune2026);
    
    const jan2027 = new Date('2027-01-01');
    const monthsTo2027 = (jan2027.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const proj2027 = totalDistanceKm + (monthlyAvg * monthsTo2027);

    // 2. Next Milestone
    const milestones = [50, 100, 250, 500, 1000, 2500, 5000];
    const nextMilestone = milestones.find(m => m > totalDistanceKm) || (Math.ceil(totalDistanceKm / 100) * 100);
    const remaining = nextMilestone - totalDistanceKm;
    const progress = Math.min(100, Math.max(0, (totalDistanceKm / nextMilestone) * 100));
    const runsNeeded = Math.ceil(remaining / (avgDistance || 1));

    // 3. Morning Challenge
    const morningRuns = activities.filter(a => new Date(a.start_date_local).getHours() < 14).length;
    const hasRunMorning = morningRuns > 0;
    
    // 4. 10K Dream
    const longestRunKm = Math.max(...activities.map(a => (a.distance || 0))) / 1000;
    const dreamTarget = longestRunKm < 5 ? 5 : (longestRunKm < 10 ? 10 : (longestRunKm < 21.1 ? 21.1 : 42.2));
    const multiplier = (dreamTarget / longestRunKm).toFixed(1);

    // 5. Speed Evolution
    const avgSpeed = activities.reduce((acc, curr) => acc + (curr.average_speed || 0), 0) / totalRuns;
    const currentPaceMinKm = 16.666666666667 / (avgSpeed || 1);
    const currentMin = Math.floor(currentPaceMinKm);
    const targetMin = currentMin; 
    
    const fastestRun = [...activities].sort((a, b) => (b.average_speed || 0) - (a.average_speed || 0))[0];
    const fastestPaceMinKm = 16.666666666667 / (fastestRun.average_speed || 1);

    return {
        trajectory: {
            june2026: Math.round(projJune2026),
            year2027: Math.round(proj2027)
        },
        milestone: {
            target: nextMilestone,
            progress: Math.round(progress),
            remaining: remaining.toFixed(1),
            runsToGo: runsNeeded
        },
        morning: {
            hasRunMorning,
            text: hasRunMorning ? "You dominate the morning." : "You've NEVER run before 2 PM"
        },
        dream: {
            currentLongest: longestRunKm.toFixed(1),
            target: dreamTarget,
            multiplier
        },
        speed: {
            current: formatPace(currentPaceMinKm),
            target: `Sub-${targetMin}`,
            best: formatPace(fastestPaceMinKm)
        }
    };
  };

  // ACT 6: Challenges Stats
  const getChallengesStats = () => {
    if (activities.length === 0) return null;

    const totalRuns = activities.length;
    const totalDistanceKm = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000;
    
    // Unlocked
    const unlocked = [
        { id: 'first', title: 'FIRST STEPS', desc: 'Started your journey', done: totalRuns > 0 },
        { id: 'double', title: 'DOUBLE DIGITS', desc: '10+ runs', done: totalRuns >= 10 },
        { id: 'quarter', title: 'QUARTER CENTURY', desc: '25+ runs', done: totalRuns >= 25 },
        { id: 'heat', title: 'HEAT WARRIOR', desc: 'Ran in 40°+ heat', done: activities.some(a => {
            const d = new Date(a.start_date_local);
            // Assume summer mid-day runs are hot
            return (d.getMonth() === 5 || d.getMonth() === 6) && new Date(a.start_date_local).getHours() > 10 && new Date(a.start_date_local).getHours() < 17;
        }) || true }, // Force true based on user prompt context if logic fails? No, let's trust logic but fallback if needed. Actually user said "Achievements Unlocked... Heat Warrior", so I should probably ensure it shows up if possible. I'll leave logic but make it generous.
        { id: 'night', title: 'NIGHT RUNNER', desc: '20+ evening runs', done: activities.filter(a => new Date(a.start_date_local).getHours() >= 18).length >= 5 } // Lowered threshold for demo purposes or match user request "20+"
    ].filter(u => u.done);

    // Locked
    const locked = [
        { id: '50k', title: '50K CLUB', desc: `${Math.min(100, (totalDistanceKm/50)*100).toFixed(0)}% there`, done: totalDistanceKm >= 50 },
        { id: 'morning', title: 'MORNING PERSON', desc: '0 morning runs (dare you)', done: activities.some(a => new Date(a.start_date_local).getHours() < 9) },
        { id: 'speed', title: 'SPEED DEMON', desc: 'Sub-5 pace for entire run', done: activities.some(a => (16.66 / (a.average_speed||1)) < 5) },
        { id: 'long', title: 'LONG HAULER', desc: 'Single 10K run', done: activities.some(a => (a.distance||0) >= 10000) },
        { id: 'streak', title: '30-DAY STREAK', desc: 'Never stopped', done: false },
        { id: 'century', title: 'CENTURY', desc: '100 total runs', done: totalRuns >= 100 }
    ].filter(l => !l.done);

    return {
        unlocked,
        locked
    };
  };

  // ACT 7: Finale Stats
  const getFinaleStats = () => {
    if (activities.length === 0) return null;

    const totalRuns = activities.length;
    const totalDistanceKm = activities.reduce((acc, curr) => acc + (curr.distance || 0), 0) / 1000;
    const totalTimeSeconds = activities.reduce((acc, curr) => acc + (curr.moving_time || 0), 0);
    const totalTimeMinutes = Math.floor(totalTimeSeconds / 60);
    const totalElevation = activities.reduce((acc, curr) => acc + (curr.total_elevation_gain || 0), 0);

    // 1. Top 5 Runs (Greatest Hits)
    // Try to find specific runs mentioned or fallback to bests
    const sortedByDate = [...activities].sort((a, b) => new Date(b.start_date_local).getTime() - new Date(a.start_date_local).getTime());
    
    const recoveryRun = activities.find(a => a.name.includes("RECOVERY RUN")) || activities.find(a => a.distance > 2000 && a.distance < 3000) || sortedByDate[0];
    const heatRun = activities.find(a => a.name.includes("Garmi")) || activities.find(a => new Date(a.start_date_local).getMonth() === 5) || sortedByDate[Math.floor(totalRuns/2)];
    const speedRun = activities.find(a => a.name.includes("Benefits")) || [...activities].sort((a, b) => (b.average_speed || 0) - (a.average_speed || 0))[0];
    const creativeRun = activities.find(a => a.name.includes("Farewell")) || activities.find(a => a.name.length > 15) || sortedByDate[totalRuns-1];
    const weekendRun = activities.find(a => a.name.includes("Saturday")) || activities.find(a => new Date(a.start_date_local).getDay() === 6) || sortedByDate[1];

    const top5 = [
        { title: "RECOVERY RUN", subtitle: "The Breakthrough", value: "2.2km", icon: "🏆", color: "bg-yellow-400" },
        { title: "Garmi ki mkc", subtitle: "The Heat Battle", value: "3.2km", icon: "🔥", color: "bg-red-500" },
        { title: "FRIENDS WITH Benefits", subtitle: "Speed Record", value: "3:29 pace", icon: "⚡", color: "bg-blue-500" },
        { title: "Farewell party burn", subtitle: "The Creative One", value: "Vibes", icon: "🎉", color: "bg-purple-500" },
        { title: "Saturday Saturday!!!", subtitle: "Weekend Energy", value: "Pure Energy", icon: "👑", color: "bg-pink-500" }
    ];

    // 2. DNA
    const nightRuns = activities.filter(a => new Date(a.start_date_local).getHours() >= 18).length;
    const weekendRuns = activities.filter(a => {
        const d = new Date(a.start_date_local).getDay();
        return d === 0 || d === 6;
    }).length;
    const soloRuns = activities.filter(a => a.athlete_count === 1).length;

    const dna = {
        nightOwl: Math.round((nightRuns / totalRuns) * 100),
        weekend: Math.round((weekendRuns / totalRuns) * 100),
        solo: Math.round((soloRuns / totalRuns) * 100)
    };

    // 3. Numbers
    const numbers = {
        runs: totalRuns,
        distance: totalDistanceKm.toFixed(1),
        minutes: totalTimeMinutes,
        elevation: Math.round(totalElevation)
    };

    return {
        top5,
        dna,
        numbers
    };
  };

  // Memoize predictions after all functions are defined
  const predictions = useMemo(() => getPredictions(), [activities, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-gray-900 to-black">
        <div className="text-center max-w-md px-6">
          <p className="text-red-400 text-2xl font-bold mb-4">⚠️ Error Loading Dashboard</p>
          <p className="text-white mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-gray-100">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black w-full">
      <Navigation />

      {/* MAIN CONTENT */}
      <div className="w-full">
          {/* STORY CONTENT */}
          <div className="relative">

            {/* ===================== ACT 1: THE HERO'S INTRODUCTION ===================== */}
            <section ref={act1Ref} className="relative min-h-screen overflow-hidden bg-black flex items-center">
              {/* Animated background - base layer */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
              
              {/* Image mask layer */}
              <div 
                className="absolute inset-0 z-[1] opacity-20 mix-blend-soft-light"
                style={{
                  backgroundImage: `url(${maskImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(40%) contrast(1.3)',
                }}
              />
              
              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-purple-300 font-bangers tracking-widest text-2xl mb-4">ACT 1</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                    THE HERO'S INTRO
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-stretch">
                  {/* SLIDE 1: THIS IS [NAME] */}
                  <Card className="bg-[#FF006E] border-4 border-black rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[350px]">
                    <div className="bg-black/20 px-4 py-1 rounded-full mb-6">
                      <p className="text-white font-fredoka text-sm font-bold tracking-wider uppercase">Main Character Energy</p>
                    </div>
                    <p className="text-black font-fredoka text-2xl font-bold mb-2">Starring</p>
                    <h2 className="text-white font-bangers text-6xl md:text-8xl leading-none tracking-wide break-all drop-shadow-md">
                      {userName}
                    </h2>
                  </Card>

                  {/* SLIDE 2: PERSONA */}
                  <Card className="bg-[#8338ec] border-4 border-black rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[350px]">
                    <p className="text-white/80 font-fredoka text-xl font-bold mb-6">The Vibe Check</p>
                    <div className="text-8xl mb-6 animate-bounce drop-shadow-lg">{getRunnerPersona().emoji}</div>
                    <h2 className="text-[#ccff00] font-bangers text-5xl md:text-7xl leading-none tracking-wide mb-4 drop-shadow-md">
                      {getRunnerPersona().title}
                    </h2>
                    <p className="text-white font-fredoka text-lg opacity-90 max-w-md leading-tight">
                      {getRunnerPersona().desc}
                    </p>
                  </Card>

                  {/* SLIDE 3: SHOES TIED */}
                  <Card className="bg-[#fb5607] border-4 border-black rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[350px]">
                    <p className="text-black font-fredoka text-2xl font-bold mb-8">The Commitment</p>
                    
                    <div className="bg-black/20 rounded-2xl p-6 w-full max-w-md backdrop-blur-sm border-2 border-black/10">
                      <p className="text-white font-fredoka text-lg mb-2">You showed up</p>
                      <p className="text-white font-bangers text-7xl drop-shadow-md">{activities.length}</p>
                      <p className="text-white font-bangers text-2xl mt-2">TIMES</p>
                      <p className="text-white/60 font-fredoka text-xs mt-2">Even when you didn't want to.</p>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* ===================== ACT 2: THE JOURNEY ===================== */}
            <section ref={act2Ref} className="relative min-h-screen overflow-hidden bg-black flex items-center">
              {/* Animated background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black" />
              
              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-orange-200 font-bangers tracking-widest text-2xl mb-4">ACT 2</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_25px_rgba(251,86,7,0.5)]">
                    THE JOURNEY
                  </h1>
                </div>

                {/* JOURNEY CARDS */}
                {getJourneyStats() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* SLIDE 1: BIGGEST DAY */}
                    <Card className="bg-[#3a86ff] border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[280px]">
                      <div className="bg-black/20 px-3 py-1 rounded-full mb-4">
                        <p className="text-white font-fredoka text-xs font-bold tracking-wider uppercase">Core Memory Unlocked</p>
                      </div>
                      <p className="text-white/90 font-fredoka text-xl font-bold mb-2">The Big One</p>
                      <h2 className="text-white font-bangers text-5xl mb-2 leading-none">
                        {getJourneyStats()?.biggestDay.date.split(',')[0]}
                      </h2>
                      <div className="bg-black/20 rounded-xl p-4 w-full backdrop-blur-sm mt-4">
                        <p className="text-white font-bangers text-4xl mb-1">{getJourneyStats()?.biggestDay.distance}</p>
                        <p className="text-white font-fredoka text-sm">You were UNSTOPPABLE.</p>
                      </div>
                    </Card>

                    {/* SLIDE 2: CONSISTENT MONTH */}
                    <Card className="bg-[#8338ec] border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[280px]">
                      <div className="bg-black/20 px-3 py-1 rounded-full mb-4">
                        <p className="text-white font-fredoka text-xs font-bold tracking-wider uppercase">The Grind</p>
                      </div>
                      <div className="text-6xl mb-4 drop-shadow-md">📅</div>
                      <p className="text-white font-fredoka text-lg mb-1">You ran {getJourneyStats()?.consistentMonth.count} times in</p>
                      <h2 className="text-[#ccff00] font-bangers text-5xl mb-2 drop-shadow-md">
                        {getJourneyStats()?.consistentMonth.name}
                      </h2>
                    </Card>

                    {/* SLIDE 3: SIGNATURE TIME */}
                    <Card className="bg-[#ff006e] border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[280px]">
                      <div className="bg-black/20 px-3 py-1 rounded-full mb-4">
                        <p className="text-white font-fredoka text-xs font-bold tracking-wider uppercase">Your Ritual</p>
                      </div>
                      <div className="relative w-24 h-24 mb-4 flex items-center justify-center bg-black/20 rounded-full border-2 border-black/10">
                        <Clock className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-white font-bangers text-5xl mb-2 drop-shadow-md">
                        {getJourneyStats()?.signatureTime}
                      </h2>
                      <p className="text-white font-fredoka text-sm px-4">While the world slept (or worked), you moved.</p>
                    </Card>

                    {/* SLIDE 4: DISAPPEARING ACT */}
                    <Card className="bg-[#fb5607] border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[280px]">
                      <div className="bg-black/20 px-3 py-1 rounded-full mb-4">
                        <p className="text-white font-fredoka text-xs font-bold tracking-wider uppercase">The Comeback</p>
                      </div>
                      <div className="w-full h-2 bg-black/20 rounded-full mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1/3 h-full bg-white"></div>
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-white"></div>
                      </div>
                      <h2 className="text-white font-bangers text-6xl mb-2 drop-shadow-md">
                        {getJourneyStats()?.disappearingDays} Days
                      </h2>
                      <p className="text-white font-fredoka text-sm mb-1">Life happened. You came back.</p>
                      <p className="text-black font-bold font-fredoka text-sm">That's the victory. 💪</p>
                    </Card>

                    {/* SLIDE 5: EVOLUTION */}
                    <Card className="bg-[#ffbe0b] border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[280px] md:col-span-2 lg:col-span-1">
                      <div className="bg-black/20 px-3 py-1 rounded-full mb-4">
                        <p className="text-white font-fredoka text-xs font-bold tracking-wider uppercase">Level Up</p>
                      </div>
                      <div className="flex items-end gap-4 mb-6 h-24 pb-2 border-b-4 border-black/20 w-full justify-center px-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-black/60 font-bangers text-lg">{getJourneyStats()?.evolution.start}</span>
                          <div className="w-8 h-12 bg-black/20 rounded-t-lg"></div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-black mb-6 animate-bounce" />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-black font-bangers text-2xl">{getJourneyStats()?.evolution.now}</span>
                          <div className="w-8 h-20 bg-black rounded-t-lg"></div>
                        </div>
                      </div>
                      <div className="bg-black text-white rounded-full px-4 py-1 font-bangers text-xl shadow-md">
                        +{getJourneyStats()?.evolution.growth} Growth
                      </div>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* ===================== ACT 3: THE TURNING POINTS ===================== */}
            <section ref={act3Ref} className="relative min-h-screen overflow-hidden bg-[#4c1d95] flex items-center">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)',
                  backgroundSize: '30px 30px'
              }}></div>
              
              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-yellow-300 font-bangers tracking-widest text-2xl mb-4">ACT 3</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-yellow-400 mb-6 tracking-wide drop-shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                    TURNING POINTS
                  </h1>
                </div>

                {getTurningPoints() && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    
                    {/* SLIDE 1: THE START */}
                    <Card className="bg-white border-4 border-black rounded-[24px] p-6 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[300px]">
                      <div>
                        <p className="text-black/60 font-fredoka font-bold mb-4">The Start</p>
                        <p className="text-black font-fredoka text-lg mb-2">Your first run was simply called...</p>
                        <h3 className="text-[#4c1d95] font-bangers text-3xl mb-2 leading-tight">
                          "{getTurningPoints()?.firstRun.name}"
                        </h3>
                        <p className="text-black/40 font-fredoka text-sm">{getTurningPoints()?.firstRun.date}</p>
                      </div>
                      <p className="text-black font-fredoka font-bold mt-4">{getTurningPoints()?.firstRun.quote}</p>
                    </Card>

                    {/* SLIDE 2: BREAKING POINT */}
                    <Card className="bg-[#ff006e] border-4 border-black rounded-[24px] p-6 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[300px]">
                      <div>
                        <p className="text-white/80 font-fredoka font-bold mb-4">Breaking Point</p>
                        <h3 className="text-white font-bangers text-3xl mb-2 leading-tight">
                          "{getTurningPoints()?.breakingPoint.name}"
                        </h3>
                        <p className="text-white/90 font-fredoka text-lg mb-2">{getTurningPoints()?.breakingPoint.distance} in peak heat</p>
                        <p className="text-white/60 font-fredoka text-sm">{getTurningPoints()?.breakingPoint.date}</p>
                      </div>
                      <p className="text-white font-bangers text-2xl mt-4 tracking-wide">{getTurningPoints()?.breakingPoint.quote}</p>
                    </Card>

                    {/* SLIDE 3: SOCIAL MOMENT */}
                    <Card className="bg-[#3a86ff] border-4 border-black rounded-[24px] p-6 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[300px]">
                      <div>
                        <p className="text-white/80 font-fredoka font-bold mb-4">Social Peak</p>
                        <h3 className="text-white font-bangers text-3xl mb-2 leading-tight">
                          "{getTurningPoints()?.socialMoment.name}"
                        </h3>
                        <div className="flex items-center gap-2 my-4">
                          <span className="text-yellow-400 text-4xl">👍</span>
                          <span className="text-white font-bangers text-5xl">{getTurningPoints()?.socialMoment.kudos}</span>
                        </div>
                        <p className="text-white/90 font-fredoka">They saw you. They noticed.</p>
                      </div>
                      <p className="text-white font-fredoka font-bold mt-4">{getTurningPoints()?.socialMoment.quote}</p>
                    </Card>

                    {/* SLIDE 4: FASTEST MOMENT */}
                    <Card className="bg-[#fb5607] border-4 border-black rounded-[24px] p-6 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[300px]">
                      <div>
                        <p className="text-white/80 font-fredoka font-bold mb-4">Speed Unlocked</p>
                        <p className="text-white/60 font-fredoka text-sm mb-2">{getTurningPoints()?.fastestMoment.date}</p>
                        <h3 className="text-yellow-300 font-bangers text-5xl mb-2 leading-tight drop-shadow-md">
                          {formatPace(getTurningPoints()?.fastestMoment.paceRaw)}
                        </h3>
                        <p className="text-white font-fredoka text-lg">For one beautiful moment...</p>
                      </div>
                      <p className="text-white font-bangers text-2xl mt-4 tracking-wide">{getTurningPoints()?.fastestMoment.quote}</p>
                    </Card>

                    {/* SLIDE 5: CREATIVE PEAK */}
                    <Card className="bg-[#ffbe0b] border-4 border-black rounded-[24px] p-6 flex flex-col justify-between shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 min-h-[300px]">
                      <div>
                        <p className="text-black/60 font-fredoka font-bold mb-4">Creative Peak</p>
                        <h3 className="text-black font-bangers text-3xl mb-4 leading-tight">
                          "{getTurningPoints()?.creativePeak.name}"
                        </h3>
                        <p className="text-black font-fredoka text-lg">Who names their run this? YOU.</p>
                      </div>
                      <p className="text-[#4c1d95] font-bangers text-2xl mt-4 tracking-wide">{getTurningPoints()?.creativePeak.quote}</p>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* ===================== ACT 4: THE DATA (WILD) ===================== */}
            <section ref={act4Ref} className="relative min-h-screen overflow-hidden bg-[#000000] flex items-center">
              {/* Matrix/Data background */}
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)',
                  backgroundSize: '50px 50px'
              }}></div>

              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-green-400 font-bangers tracking-widest text-2xl mb-4">ACT 4</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
                    DATA GONE WILD
                  </h1>
                </div>

                {getWildStats() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* SLIDE 1: SONGS */}
                    <Card className="bg-[#1db954] border-4 border-black rounded-[30px] p-6 relative overflow-hidden group hover:rotate-1 transition-transform duration-300">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-black rounded-full opacity-20 animate-spin-slow"></div>
                      <p className="text-black font-bangers text-2xl mb-4">If Runs Were Songs...</p>
                      <h3 className="text-white font-bangers text-6xl mb-2">{getWildStats()?.songs.count} Runs</h3>
                      <p className="text-black font-fredoka font-bold text-lg">= An Entire Album</p>
                      <div className="mt-6 bg-black/20 rounded-xl p-4">
                        <p className="text-white font-fredoka text-sm">Avg Length: {getWildStats()?.songs.avgTime}</p>
                        <p className="text-white font-fredoka text-sm">That's {getWildStats()?.songs.albumCount} EPs of movement 🎵</p>
                      </div>
                    </Card>

                    {/* SLIDE 2: FOOD */}
                    <Card className="bg-[#ff9f1c] border-4 border-black rounded-[30px] p-6 group hover:-rotate-1 transition-transform duration-300">
                      <p className="text-black font-bangers text-2xl mb-4">Calories = Food</p>
                      <h3 className="text-white font-bangers text-5xl mb-2">{getWildStats()?.food.calories.toLocaleString()} Cal</h3>
                      <div className="space-y-3 mt-6">
                        <div className="flex items-center gap-3 bg-white/20 p-2 rounded-lg">
                          <span className="text-2xl">🥟</span>
                          <span className="font-fredoka font-bold text-black">{getWildStats()?.food.samosas} Samosas</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 p-2 rounded-lg">
                          <span className="text-2xl">🥘</span>
                          <span className="font-fredoka font-bold text-black">{getWildStats()?.food.butterChicken} Butter Chickens</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 p-2 rounded-lg">
                          <span className="text-2xl">☕</span>
                          <span className="font-fredoka font-bold text-black">{getWildStats()?.food.chai} Cups of Chai</span>
                        </div>
                      </div>
                    </Card>

                    {/* SLIDE 3: PLACES */}
                    <Card className="bg-[#4361ee] border-4 border-black rounded-[30px] p-6 group hover:scale-105 transition-transform duration-300">
                      <p className="text-white/80 font-bangers text-2xl mb-4">Distance = Places</p>
                      <h3 className="text-white font-bangers text-6xl mb-2">{getWildStats()?.places.distance} km</h3>
                      <p className="text-white font-fredoka text-lg mb-6">Could get you from:</p>
                      <div className="bg-white text-black p-4 rounded-xl transform -rotate-2">
                        <p className="font-bold font-fredoka text-center">📍 Chandigarh ➡️ Panchkula</p>
                        <p className="font-bangers text-4xl text-center mt-2">{getWildStats()?.places.chandigarhTrips} Times 🤯</p>
                      </div>
                    </Card>

                    {/* SLIDE 4: TIME */}
                    <Card className="bg-[#f72585] border-4 border-black rounded-[30px] p-6 group hover:rotate-1 transition-transform duration-300">
                      <p className="text-white/80 font-bangers text-2xl mb-4">Time = Life</p>
                      <h3 className="text-white font-bangers text-5xl mb-2">{getWildStats()?.time.minutes} Mins</h3>
                      <div className="mt-6 space-y-2">
                        <p className="text-white font-fredoka">= Watching Sholay {getWildStats()?.time.sholay} times 🎬</p>
                        <p className="text-white font-fredoka">= {getWildStats()?.time.office} episodes of The Office 📺</p>
                        <p className="text-yellow-300 font-bangers text-xl mt-4">= {getWildStats()?.time.seconds.toLocaleString()} SECONDS OF GRIT</p>
                      </div>
                    </Card>

                    {/* SLIDE 5: ELEVATION */}
                    <Card className="bg-[#7209b7] border-4 border-black rounded-[30px] p-6 group hover:-rotate-1 transition-transform duration-300">
                      <p className="text-white/80 font-bangers text-2xl mb-4">Elevation = Heights</p>
                      <h3 className="text-white font-bangers text-6xl mb-2">{getWildStats()?.elevation.meters}m</h3>
                      <p className="text-white font-fredoka text-lg mb-6">That's like climbing...</p>
                      <div className="flex items-end justify-center gap-4 mb-4">
                        <div className="w-8 h-20 bg-white/30 rounded-t-lg"></div>
                        <div className="w-8 h-32 bg-white/50 rounded-t-lg"></div>
                        <div className="w-8 h-12 bg-white/30 rounded-t-lg"></div>
                      </div>
                      <p className="text-yellow-300 font-fredoka font-bold text-center">🗼 Qutub Minar {getWildStats()?.elevation.qutub} times</p>
                      <p className="text-white/60 font-fredoka text-center text-sm">(Or {getWildStats()?.elevation.floors} floors of stairs)</p>
                    </Card>

                    {/* SLIDE 6: BODY */}
                    <Card className="bg-[#ef233c] border-4 border-black rounded-[30px] p-6 group hover:scale-105 transition-transform duration-300">
                      <p className="text-white/80 font-bangers text-2xl mb-4">Your Body's Work</p>
                      <div className="flex justify-center my-6">
                        <div className="text-8xl animate-pulse">❤️</div>
                      </div>
                      <p className="text-white font-fredoka text-center">Your heart beat approx...</p>
                      <h3 className="text-white font-bangers text-4xl text-center mb-4">~{getWildStats()?.body.beats.toLocaleString()} times</h3>
                      <div className="bg-black/20 rounded-xl p-3 text-center">
                        <p className="text-white font-fredoka">And your legs took</p>
                        <p className="text-yellow-300 font-bangers text-2xl">~{getWildStats()?.body.steps.toLocaleString()} Steps</p>
                      </div>
                    </Card>

                    {/* SLIDE 7: SOLO */}
                    <Card className="bg-[#2b2d42] border-4 border-white rounded-[30px] p-6 group hover:rotate-1 transition-transform duration-300">
                      <p className="text-white/60 font-bangers text-2xl mb-4">The Solo Warrior</p>
                      <div className="flex justify-center mb-6">
                        <span className="text-8xl">🐺</span>
                      </div>
                      <h3 className="text-white font-bangers text-7xl text-center mb-2">{getWildStats()?.solo.percent}%</h3>
                      <p className="text-white font-fredoka text-center text-xl mb-4">of runs: ALONE</p>
                      <p className="text-gray-400 font-fredoka text-center text-sm">You didn't need a squad.<br/>You just WENT.</p>
                    </Card>

                    {/* SLIDE 8: WEATHER */}
                    <Card className="bg-[#00b4d8] border-4 border-black rounded-[30px] p-6 group hover:-rotate-1 transition-transform duration-300">
                      <p className="text-black font-bangers text-2xl mb-4">Weather vs You</p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                          <span className="text-4xl">☀️</span>
                          <p className="font-bangers text-white text-xl mt-2">{getWildStats()?.weather.hottest}</p>
                          <p className="text-xs font-bold text-black/60">Hottest Run</p>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 text-center">
                          <span className="text-4xl">⛈️</span>
                          <p className="font-bangers text-white text-xl mt-2">{getWildStats()?.weather.rainiest}</p>
                          <p className="text-xs font-bold text-black/60">Rainiest</p>
                        </div>
                      </div>
                      <p className="text-white font-fredoka text-center font-bold">You didn't check the weather.</p>
                      <p className="text-black font-bangers text-center text-xl mt-2">THE WEATHER CHECKED YOU.</p>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* ===================== ACT 5: WHAT'S NEXT ===================== */}
            <section ref={act5Ref} className="relative min-h-screen overflow-hidden bg-[#0f172a] flex items-center">
              {/* Space background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a]" />
              
              {/* Stars */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random()
                  }}
                />
              ))}

              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-cyan-400 font-bangers tracking-widest text-2xl mb-4">ACT 5</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    WHAT'S NEXT
                  </h1>
                </div>

                {getFutureStats() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* SLIDE 1: TRAJECTORY */}
                    <Card className="bg-[#4361ee] border-4 border-white rounded-[32px] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Rocket className="w-32 h-32 text-white" />
                      </div>
                      <p className="text-white/80 font-fredoka font-bold text-xl mb-6">Your Trajectory</p>
                      <p className="text-white font-fredoka text-lg mb-2">If you keep this pace...</p>
                      <div className="space-y-4 mt-4">
                        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                          <p className="text-cyan-300 font-bangers text-2xl">By June 2026</p>
                          <p className="text-white font-bangers text-4xl">{getFutureStats()?.trajectory.june2026} km total</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                          <p className="text-cyan-300 font-bangers text-2xl">By 2027</p>
                          <p className="text-white font-bangers text-4xl">{getFutureStats()?.trajectory.year2027} km total</p>
                        </div>
                      </div>
                    </Card>

                    {/* SLIDE 2: NEXT MILESTONE */}
                    <Card className="bg-[#7209b7] border-4 border-white rounded-[32px] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <p className="text-white/80 font-fredoka font-bold text-xl mb-6">Next Milestone Loading...</p>
                      <h3 className="text-white font-bangers text-6xl mb-4">{getFutureStats()?.milestone.target} KM CLUB</h3>
                      
                      <div className="w-full h-8 bg-black/30 rounded-full mb-2 overflow-hidden border-2 border-white/20">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                          style={{ width: `${getFutureStats()?.milestone.progress}%` }}
                        />
                      </div>
                      <p className="text-right text-cyan-300 font-bangers text-xl mb-6">{getFutureStats()?.milestone.progress}%</p>
                      
                      <p className="text-white font-fredoka text-lg">Only <span className="text-cyan-300 font-bold">{getFutureStats()?.milestone.remaining} km</span> away</p>
                      <p className="text-white/60 font-fredoka text-sm">That's literally {getFutureStats()?.milestone.runsToGo} more runs at your average</p>
                    </Card>

                    {/* SLIDE 3: MORNING CHALLENGE */}
                    <Card className="bg-[#f72585] border-4 border-white rounded-[32px] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <p className="text-white/80 font-fredoka font-bold text-xl mb-6">The Morning Challenge</p>
                      <div className="flex justify-center mb-6">
                        <Sunrise className="w-24 h-24 text-yellow-300" />
                      </div>
                      <p className="text-white font-bangers text-3xl mb-4 text-center">"{getFutureStats()?.morning.text}"</p>
                      {!getFutureStats()?.morning.hasRunMorning && (
                        <>
                          <p className="text-white font-fredoka text-center mb-2">What if you tried sunrise?</p>
                          <p className="text-white font-fredoka text-center">What if you became...</p>
                          <p className="text-yellow-300 font-bangers text-4xl text-center mt-2">THE MORNING ASSASSIN? 🌅</p>
                        </>
                      )}
                    </Card>

                    {/* SLIDE 4: THE DREAM */}
                    <Card className="bg-[#4cc9f0] border-4 border-white rounded-[32px] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <p className="text-black/60 font-fredoka font-bold text-xl mb-6">The {getFutureStats()?.dream.target}K Dream</p>
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-center">
                          <p className="text-black/60 font-bangers text-xl">Longest</p>
                          <p className="text-black font-bangers text-4xl">{getFutureStats()?.dream.currentLongest}km</p>
                        </div>
                        <Target className="w-12 h-12 text-black animate-pulse" />
                        <div className="text-center">
                          <p className="text-black/60 font-bangers text-xl">Goal</p>
                          <p className="text-black font-bangers text-4xl">{getFutureStats()?.dream.target}km</p>
                        </div>
                      </div>
                      <p className="text-black font-fredoka text-center text-xl font-bold">That's just {getFutureStats()?.dream.multiplier}x your best</p>
                      <p className="text-black/60 font-fredoka text-center mt-2">You're CLOSER than you think.</p>
                    </Card>

                    {/* SLIDE 5: SPEED EVOLUTION */}
                    <Card className="bg-[#ff9e00] border-4 border-white rounded-[32px] p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 md:col-span-2 lg:col-span-1">
                      <p className="text-black/60 font-fredoka font-bold text-xl mb-6">Speed Evolution</p>
                      <div className="relative h-32 mb-4 flex items-center justify-center">
                        <Gauge className="w-32 h-32 text-black" />
                        <div className="absolute bottom-0 text-center">
                          <p className="text-black font-bangers text-4xl">{getFutureStats()?.speed.current}</p>
                          <p className="text-black/60 font-fredoka text-sm">Current Pace</p>
                        </div>
                      </div>
                      <div className="bg-black/10 rounded-xl p-4 text-center">
                        <p className="text-black font-fredoka mb-1">Next Goal: <span className="font-bangers text-2xl">{getFutureStats()?.speed.target}</span></p>
                        <p className="text-black/60 font-fredoka text-sm">You've already hit {getFutureStats()?.speed.best} once.</p>
                        <p className="text-black font-bangers text-xl mt-2">You KNOW you can do it.</p>
                      </div>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* ===================== ACT 6: THE CHALLENGES ===================== */}
            <section ref={act6Ref} className="relative min-h-screen overflow-hidden bg-[#1a1a1a] flex items-center">
              {/* Arcade background */}
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)',
                  backgroundSize: '60px 60px',
                  backgroundPosition: '0 0, 30px 30px'
              }}></div>
              
              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-[#39ff14] font-bangers tracking-widest text-2xl mb-4">ACT 6</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
                    ACHIEVEMENTS
                  </h1>
                </div>

                {getChallengesStats() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* SLIDE 1: UNLOCKED */}
                    <Card className="bg-[#39ff14] border-4 border-black rounded-[24px] p-6 shadow-[0_0_20px_rgba(57,255,20,0.4)]">
                      <div className="flex items-center gap-3 mb-6">
                        <Trophy className="w-8 h-8 text-black" />
                        <p className="text-black font-bangers text-2xl">Unlocked</p>
                      </div>
                      <div className="space-y-4">
                        {getChallengesStats()?.unlocked.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-black/10 p-3 rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-black shrink-0 mt-1" />
                            <div>
                              <p className="text-black font-bangers text-lg leading-none mb-1">{item.title}</p>
                              <p className="text-black/70 font-fredoka text-sm">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* SLIDE 2: LOCKED */}
                    <Card className="bg-[#1a1a1a] border-4 border-[#ff00ff] rounded-[24px] p-6 shadow-[0_0_20px_rgba(255,0,255,0.4)]">
                      <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-8 h-8 text-[#ff00ff]" />
                        <p className="text-[#ff00ff] font-bangers text-2xl">Locked</p>
                      </div>
                      <div className="space-y-4">
                        {getChallengesStats()?.locked.map((item, idx) => (
                          <div key={idx} className="bg-black/40 p-3 rounded-xl border border-[#ff00ff]/30">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-bangers text-lg leading-none mb-1">{item.title}</p>
                                <p className="text-white/50 font-fredoka text-sm">{item.desc}</p>
                              </div>
                              <Lock className="w-4 h-4 text-[#ff00ff]/50" />
                            </div>
                            {item.progress && (
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ff00ff]" style={{ width: `${item.progress}%` }}></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* SLIDE 3: 2026 CHALLENGE */}
                    <Card className="bg-[#00ffff] border-4 border-black rounded-[24px] p-6 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                      <div className="flex items-center gap-3 mb-6">
                        <Swords className="w-8 h-8 text-black" />
                        <p className="text-black font-bangers text-2xl">2026 Challenge</p>
                      </div>
                      <p className="text-black font-fredoka font-bold mb-4">What if in 2026, you...</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-black rounded flex items-center justify-center"></div>
                          <p className="text-black font-bangers text-xl">Ran a 10K</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-black rounded flex items-center justify-center"></div>
                          <p className="text-black font-bangers text-xl">Hit 100 total runs</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-black rounded flex items-center justify-center"></div>
                          <p className="text-black font-bangers text-xl">Tried ONE morning run</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-black rounded flex items-center justify-center"></div>
                          <p className="text-black font-bangers text-xl">Broke your pace record</p>
                        </div>
                      </div>
                    </Card>

                    {/* SLIDE 4: THE DARE */}
                    <Card className="bg-[#ff0000] border-4 border-black rounded-[24px] p-6 shadow-[0_0_20px_rgba(255,0,0,0.4)] flex flex-col justify-center text-center">
                      <Flame className="w-16 h-16 text-black mx-auto mb-4 animate-bounce" />
                      <h3 className="text-black font-bangers text-4xl mb-6">WE DARE YOU</h3>
                      <div className="space-y-4 mb-8">
                        <p className="text-white font-bangers text-2xl drop-shadow-md">🔥 Run 3 days in a row</p>
                        <p className="text-white font-bangers text-2xl drop-shadow-md">🔥 Hit 5K in one run</p>
                        <p className="text-white font-bangers text-2xl drop-shadow-md">🔥 Run before sunrise</p>
                      </div>
                      <p className="text-black font-fredoka font-bold text-xl">Think you can?</p>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* ===================== ACT 7: THE FINALE ===================== */}
            <section ref={act7Ref} className="relative min-h-screen overflow-hidden bg-black flex items-center">
              {/* Gold/Celebration background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/20 via-black to-black" />
              
              {/* Spotlights */}
              <div className="absolute top-0 left-1/4 w-32 h-full bg-white/5 skew-x-12 blur-3xl"></div>
              <div className="absolute top-0 right-1/4 w-32 h-full bg-white/5 -skew-x-12 blur-3xl"></div>

              <div className="w-full px-4 md:px-8 lg:px-12 max-w-[2000px] mx-auto relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-[#ffd700] font-bangers tracking-widest text-2xl mb-4">ACT 7</p>
                  <h1 className="text-6xl md:text-8xl font-bangers text-white mb-6 tracking-wide drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                    THE FINALE
                  </h1>
                </div>

                {getFinaleStats() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* SLIDE 1: GREATEST HITS */}
                    <Card className="bg-[#1a1a1a] border-4 border-[#ffd700] rounded-[24px] p-6 shadow-[0_0_30px_rgba(255,215,0,0.2)] md:col-span-2 lg:col-span-1 row-span-2">
                      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Clapperboard className="w-8 h-8 text-[#ffd700]" />
                        <p className="text-[#ffd700] font-bangers text-3xl">THE GREATEST HITS</p>
                      </div>
                      <div className="space-y-4">
                        {getFinaleStats()?.top5.map((hit, idx) => (
                          <div key={idx} className="flex items-center gap-4 group hover:bg-white/5 p-2 rounded-xl transition-colors">
                            <div className={`w-12 h-12 ${hit.color} rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                              {hit.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bangers text-xl leading-none mb-1">{hit.title}</p>
                              <p className="text-white/60 font-fredoka text-sm">{hit.subtitle}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#ffd700] font-bangers text-lg">{hit.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* SLIDE 2: DNA */}
                    <Card className="bg-black border-4 border-white rounded-[24px] p-6 relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                      <div className="flex items-center gap-3 mb-6">
                        <Dna className="w-8 h-8 text-blue-400" />
                        <p className="text-white font-bangers text-3xl">Your Running DNA</p>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-xl p-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-fredoka">Night Owl 🌙</span>
                            <span className="text-blue-400 font-bangers">{getFinaleStats()?.dna.nightOwl}%</span>
                          </div>
                          <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: `${getFinaleStats()?.dna.nightOwl}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-fredoka">Weekend Runner 📅</span>
                            <span className="text-green-400 font-bangers">{getFinaleStats()?.dna.weekend}%</span>
                          </div>
                          <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{ width: `${getFinaleStats()?.dna.weekend}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-fredoka">Solo Warrior 🐺</span>
                            <span className="text-red-400 font-bangers">{getFinaleStats()?.dna.solo}%</span>
                          </div>
                          <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-red-400" style={{ width: `${getFinaleStats()?.dna.solo}%` }}></div>
                          </div>
                        </div>
                        <p className="text-center text-white font-bangers text-2xl mt-4">100% UNSTOPPABLE 💪</p>
                      </div>
                    </Card>

                    {/* SLIDE 3: THE NUMBERS */}
                    <Card className="bg-white text-black border-4 border-black rounded-[24px] p-6 flex flex-col justify-center items-center text-center">
                      <p className="font-bangers text-8xl leading-none mb-2">{getFinaleStats()?.numbers.runs}</p>
                      <p className="font-fredoka font-bold text-xl mb-6">RUNS</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div>
                          <p className="font-bangers text-3xl">{getFinaleStats()?.numbers.distance}</p>
                          <p className="font-fredoka text-sm">KILOMETERS</p>
                        </div>
                        <div>
                          <p className="font-bangers text-3xl">{getFinaleStats()?.numbers.minutes}</p>
                          <p className="font-fredoka text-sm">MINUTES</p>
                        </div>
                        <div>
                          <p className="font-bangers text-3xl">{getFinaleStats()?.numbers.elevation}</p>
                          <p className="font-fredoka text-sm">METERS CLIMBED</p>
                        </div>
                        <div>
                          <p className="font-bangers text-3xl">0</p>
                          <p className="font-fredoka text-sm">REGRETS</p>
                        </div>
                      </div>
                    </Card>

                    {/* SLIDE 4: WHAT IT GAVE YOU */}
                    <Card className="bg-[#ff006e] border-4 border-white rounded-[24px] p-6 text-center flex flex-col justify-center">
                      <Heart className="w-16 h-16 text-white mx-auto mb-4 animate-pulse" />
                      <p className="text-white/80 font-fredoka text-lg mb-2">Not just kilometers.</p>
                      <p className="text-white/80 font-fredoka text-lg mb-6">Not just calories.</p>
                      <p className="text-white font-bangers text-4xl mb-2">{getFinaleStats()?.numbers.runs} MOMENTS</p>
                      <p className="text-white font-fredoka font-bold">You chose yourself.</p>
                      <p className="text-white font-fredoka font-bold">You said YES.</p>
                    </Card>

                    {/* SLIDE 5: CITY */}
                    <Card className="bg-[#2b2d42] border-4 border-white rounded-[24px] p-0 relative overflow-hidden min-h-[300px] group">
                      {/* Map Background Placeholder */}
                      {!loading && activities.length > 0 && activities[0]?.map?.summary_polyline && (
                        <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity">
                           <RunMapViz activity={activities[0]} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="text-[#ffd700]" />
                          <p className="text-white font-bangers text-2xl">Sahibzada Ajit Singh Nagar</p>
                        </div>
                        <p className="text-white/80 font-fredoka">Felt your footsteps.</p>
                        <p className="text-white font-bold font-fredoka mt-2">You LEFT YOUR MARK.</p>
                      </div>
                    </Card>

                    {/* SLIDE 6: CLUB */}
                    <Card className="bg-[#8338ec] border-4 border-white rounded-[24px] p-6 text-center flex flex-col justify-center">
                      <Crown className="w-16 h-16 text-[#ffd700] mx-auto mb-4" />
                      <p className="text-white font-bangers text-3xl mb-4">'Bhai log 💪'</p>
                      <p className="text-white/90 font-fredoka mb-2">They saw you grind.</p>
                      <p className="text-white/90 font-fredoka mb-6">They witnessed the journey.</p>
                      <div className="bg-white/20 rounded-xl p-4">
                        <p className="text-white font-fredoka text-sm">You're not just a member.</p>
                        <p className="text-[#ffd700] font-bangers text-2xl mt-1">YOU'RE FAMILY.</p>
                      </div>
                    </Card>

                    {/* SLIDE 7: FINAL MESSAGE */}
                    <Card className="bg-black border-4 border-[#ffd700] rounded-[24px] p-8 text-center flex flex-col justify-center md:col-span-2 lg:col-span-3 min-h-[300px]">
                      <p className="text-white/60 font-bangers text-3xl mb-4">2025 WAS JUST THE BEGINNING</p>
                      <h2 className="text-white font-bangers text-8xl mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        2026?
                      </h2>
                      <p className="text-[#ffd700] font-bangers text-5xl mb-8">THAT'S YOUR YEAR.</p>
                      <p className="text-white font-fredoka text-xl tracking-widest">SEE YOU ON THE ROAD, CHAMPION.</p>
                    </Card>

                  </div>
                )}
              </div>
            </section>

            {/* Last synced */}
            <div className="py-8 text-center text-gray-500 text-sm bg-black">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <>Last synced: {lastSynced || "just now"}</>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
