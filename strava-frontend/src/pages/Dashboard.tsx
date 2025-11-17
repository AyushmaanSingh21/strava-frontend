import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame, Award, TrendingUp, MapPin, Target, Calendar, Star, Sparkles, X, Menu } from "lucide-react";
import { getAthleteProfile, getActivities } from "@/services/stravaAPI";
import RunMapViz from "@/components/RunMapViz";
import DashboardNav from "@/components/DashboardNav";
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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default on desktop

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
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* SIDEBAR */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-black border-r border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black bg-gradient-to-r from-[#2F71FF] to-[#FF006E] bg-clip-text text-transparent">
              YOUR STORY
            </h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-2">
            {acts.map((act) => {
              const isActive = currentAct === act.num;
              const buttonClass = isActive 
                ? `w-full text-left py-4 px-4 rounded-lg transition-all bg-gradient-to-r ${act.color} text-white shadow-lg scale-105`
                : 'w-full text-left py-4 px-4 rounded-lg transition-all hover:bg-gray-800 text-gray-300 hover:text-white';
              
              return (
                <button
                  key={act.num}
                  onClick={() => scrollToAct(act.num)}
                  className={buttonClass}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{act.emoji}</span>
                      <span className="text-xs font-bold tracking-wider opacity-70">ACT {act.num}</span>
                    </div>
                    <span className="text-sm font-bold">{act.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className={`flex-1 w-full transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-0' : 'ml-0'
      }`}>
          {/* NAVBAR */}
          <DashboardNav 
            currentPage="dashboard" 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            showSidebarToggle={true}
          />

          {/* STORY CONTENT */}
          <div className="relative">

            {/* ===================== ACT 1: THE HERO'S INTRODUCTION ===================== */}
            <section ref={act1Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Floating orbs */}
              <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed" />
              
              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-purple-300 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 1</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE HERO'S<br />INTRODUCTION
                  </h1>
                  <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
                    Every great story begins with a hero. This is yours, {userName}.
                  </p>
                </div>

                {/* PERSONA */}
                <div className="max-w-4xl mx-auto mb-16">
                  <Card className={`bg-gradient-to-r ${getRunnerPersona().color} p-12 text-white border-0 shadow-2xl`}>
                    <div className="text-center">
                      <div className="text-8xl mb-6">{getRunnerPersona().emoji}</div>
                      <h2 className="text-5xl font-black mb-4">{getRunnerPersona().title}</h2>
                      <p className="text-2xl opacity-90">{getRunnerPersona().desc}</p>
                    </div>
                  </Card>
                </div>

                {/* ORIGIN STORY, TERRITORY, SIGNATURE MOVE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-white">
                    <div className="text-5xl mb-4">📜</div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">Origin Story</h3>
                    <p className="text-3xl font-black mb-2">{getOriginStory()}</p>
                    <p className="text-sm opacity-80">Since you joined the community</p>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-white">
                    <div className="text-5xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">Territory</h3>
                    <p className="text-lg font-bold mb-2">{getTerritory().location}</p>
                    <p className="text-sm opacity-80">{getTerritory().zones} unique zones explored</p>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-white">
                    <div className="text-5xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">Signature Move</h3>
                    <p className="text-2xl font-black">{getSignatureMove()}</p>
                    <p className="text-sm opacity-80">Your running style</p>
                  </Card>
                </div>
              </div>
            </section>

            {/* ===================== ACT 2: THE JOURNEY ===================== */}
            <section ref={act2Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-purple-900">
              {/* Animated sunrise background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-purple-900 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Mountain silhouettes */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse-slow" />

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-orange-200 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 2</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE JOURNEY
                  </h1>
                  <p className="text-2xl text-orange-100 max-w-3xl mx-auto">
                    Every kilometer tells a story. This is your timeline.
                  </p>
                </div>

                {/* TIMELINE */}
                <div className="max-w-5xl mx-auto">
                  <div className="space-y-6">
                    {getTimeline().map((month, idx) => (
                      <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 p-8 hover:bg-white/20 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="text-6xl">{month.emoji}</div>
                            <div>
                              <h3 className="text-2xl font-black text-white mb-1">{month.month}</h3>
                              <p className="text-orange-200">{month.runs} runs • {month.distance.toFixed(1)} km</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-5xl font-black text-white">{month.distance.toFixed(0)}</div>
                            <div className="text-sm text-orange-200">KILOMETERS</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== ACT 3: THE TURNING POINTS ===================== */}
            <section ref={act3Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-500 via-lime-600 to-green-700">
              {/* Electric theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-lime-600 to-green-700 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Lightning effect */}
              <div className="absolute top-1/4 left-1/4 w-2 h-64 bg-white/50 blur-sm animate-pulse-slow" />
              <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-float" />

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-yellow-900 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 3</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE TURNING<br />POINTS
                  </h1>
                  <p className="text-2xl text-yellow-50 max-w-3xl mx-auto">
                    These are the moments that defined your journey.
                  </p>
                </div>

                {/* MILESTONES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {getMilestones().map((milestone, idx) => (
                    <Card key={idx} className={`bg-gradient-to-br ${milestone.color} p-8 text-white border-0 shadow-2xl hover:scale-105 transition-all`}>
                      <div className="text-6xl mb-4">{milestone.icon}</div>
                      <h3 className="text-2xl font-black mb-2">{milestone.title}</h3>
                      <p className="text-lg opacity-90">{milestone.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* ===================== ACT 4: THE DATA ===================== */}
            <section ref={act4Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-950">
              {/* Map theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-blue-900 to-indigo-950 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" />
              <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 4</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE DATA
                  </h1>
                  <p className="text-2xl text-teal-100 max-w-3xl mx-auto">
                    Numbers never lie. Here's what they say about you.
                  </p>
                </div>

                {/* MAP */}
                {!loading && activities.length > 0 && activities[0]?.map?.summary_polyline && (
                  <div className="max-w-5xl mx-auto mb-12">
                    <RunMapViz activity={activities[0]} />
                  </div>
                )}

                {/* FUN STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {getFunStats().map((stat, idx) => (
                    <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-white hover:bg-white/20 transition-all">
                      <div className="text-5xl mb-4">{stat.icon}</div>
                      <div className="text-4xl font-black mb-2">{stat.value}</div>
                      <h3 className="text-sm uppercase tracking-wider font-bold mb-2 text-teal-300">{stat.label}</h3>
                      <p className="text-sm opacity-80">{stat.comment}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* ===================== ACT 5: WHAT'S NEXT ===================== */}
            <section ref={act5Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900">
              {/* Cosmic theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Stars */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-violet-300 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 5</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    WHAT'S NEXT
                  </h1>
                  <p className="text-2xl text-violet-100 max-w-3xl mx-auto">
                    The future is written in your pace. Here's what's coming.
                  </p>
                </div>

                {/* PREDICTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-10 text-white text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-cyan-300">End of Year</h3>
                    <div className="text-5xl font-black mb-2">{predictions.endOfYear.toFixed(0)}</div>
                    <p className="text-lg opacity-80">kilometers projected</p>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-10 text-white text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-violet-300">Next Milestone</h3>
                    <div className="text-5xl font-black mb-2">
                      {typeof predictions.nextMilestone === 'object' ? predictions.nextMilestone.distance : predictions.nextMilestone}K
                    </div>
                    <p className="text-lg opacity-80">
                      in ~{typeof predictions.nextMilestone === 'object' ? predictions.nextMilestone.days : 0} days
                    </p>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-10 text-white text-center">
                    <div className="text-6xl mb-4">🏃‍♂️</div>
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-blue-300">Marathon Ready?</h3>
                    <div className="text-3xl font-black mb-2">{predictions.marathonReady}</div>
                    <p className="text-lg opacity-80">at your current pace</p>
                  </Card>
                </div>
              </div>
            </section>

            {/* ===================== ACT 6: THE CHALLENGES ===================== */}
            <section ref={act6Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-red-900 via-orange-700 to-yellow-600">
              {/* Fire theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-700 to-yellow-600 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Flame effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-orange-500/20 to-transparent blur-3xl" />

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-orange-200 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 6</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE CHALLENGES
                  </h1>
                  <p className="text-2xl text-orange-100 max-w-3xl mx-auto">
                    Can you unlock them all? The journey continues.
                  </p>
                </div>

                {/* CHALLENGES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {getChallenges().map((challenge, idx) => (
                    <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black">{challenge.title}</h3>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${challenge.color}`}>
                          {Math.round(challenge.progress)}%
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${challenge.color} transition-all duration-1000`}
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-lg opacity-90">{challenge.status}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* ===================== ACT 7: THE FINALE ===================== */}
            <section ref={act7Ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900">
              {/* Celebration theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
              
              {/* Confetti */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 animate-confetti"
                  style={{
                    top: `-${Math.random() * 20}%`,
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#FF006E', '#2F71FF', '#ccff00', '#00FFF0'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 5}s`
                  }}
                />
              ))}

              <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                  <p className="text-pink-300 uppercase tracking-[0.3em] text-sm font-bold mb-4">ACT 7</p>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                    THE FINALE
                  </h1>
                  <p className="text-2xl text-pink-100 max-w-3xl mx-auto mb-8">
                    These are your greatest hits. Your highlight reel.
                  </p>
                  <div className="text-8xl mb-8">🎉</div>
                </div>

                {/* HIGHLIGHT REEL */}
                <div className="max-w-4xl mx-auto space-y-6 mb-12">
                  {getHighlightReel().map((highlight, idx) => (
                    <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 p-10 text-white hover:bg-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="text-6xl">{highlight.emoji}</div>
                          <div>
                            <p className="text-sm uppercase tracking-wider text-pink-300 font-bold mb-2">{highlight.reason}</p>
                            <h3 className="text-3xl font-black mb-2">{highlight.title}</h3>
                            <p className="text-lg opacity-80">{highlight.date} • {highlight.distance}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* FINAL MESSAGE */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-12 text-center text-white max-w-3xl mx-auto">
                  <h2 className="text-4xl font-black mb-4">THIS IS YOUR STORY</h2>
                  <p className="text-xl opacity-90 mb-8">
                    {processed.totalDistance.toFixed(1)} kilometers. {activities.length} runs. Countless moments of pushing through when it got hard.
                  </p>
                  <p className="text-2xl font-bold text-pink-300">
                    The best part? You're just getting started.
                  </p>
                </Card>
              </div>
            </section>

            {/* Last synced */}
            <div className="py-8 text-center text-gray-500 text-sm bg-gray-50">
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
