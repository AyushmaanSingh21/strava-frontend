import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame, Award, TrendingUp, MapPin, Users, Target } from "lucide-react";
import { getAthleteProfile, getActivities } from "@/services/stravaAPI";
import {
  calculateTotalDistance,
  calculateTotalTime,
  getAveragePace,
  findPersonalRecords,
} from "@/utils/dataProcessor";

const NewDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const prof = await getAthleteProfile();
        setProfile(prof || null);
        const acts = (await getActivities(1, 50)) || [];
        setActivities(Array.isArray(acts) ? acts : []);
      } catch (e: any) {
        console.error("Dashboard data fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const processed = useMemo(() => {
    const totalDistance = calculateTotalDistance(activities);
    const totalTime = calculateTotalTime(activities);
    const avgPace = getAveragePace(activities);
    const prs = findPersonalRecords(activities);
    return { totalDistance, totalTime, avgPace, prs };
  }, [activities]);

  const userName = profile?.firstname ? String(profile.firstname).toUpperCase() : "ATHLETE";
  const userCity = profile?.city || "YOUR CITY";

  // Detect runner persona
  const detectPersona = () => {
    if (activities.length === 0) return { title: "BEGINNER", desc: "Your journey starts here", color: "from-blue-primary to-purple-primary" };
    
    const morningRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 5 && hour < 11;
    }).length;
    
    const eveningRuns = activities.filter(a => {
      const hour = new Date(a.start_date_local).getHours();
      return hour >= 17 && hour < 22;
    }).length;

    const weekendRuns = activities.filter(a => {
      const day = new Date(a.start_date_local).getDay();
      return day === 0 || day === 6;
    }).length;

    if (morningRuns / activities.length > 0.6) return { title: "MORNING ASSASSIN", desc: "You own the sunrise", color: "from-orange-500 to-yellow-500" };
    if (eveningRuns / activities.length > 0.6) return { title: "EVENING WARRIOR", desc: "Sunset is your time", color: "from-purple-primary to-pink-primary" };
    if (weekendRuns / activities.length > 0.7) return { title: "WEEKEND WARRIOR", desc: "Weekends are for running", color: "from-lime-accent to-cyan-accent" };
    return { title: "CONSISTENT LEGEND", desc: "Reliable and strong", color: "from-blue-primary to-purple-primary" };
  };

  const persona = detectPersona();

  const formatPace = (paceMinPerKm?: number | null) => {
    if (!paceMinPerKm || !isFinite(paceMinPerKm)) return "-";
    const m = Math.floor(paceMinPerKm);
    const sec = Math.round((paceMinPerKm - m) * 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const funStats = [
    { 
      label: "TOTAL DISTANCE", 
      value: `${processed.totalDistance.toFixed(1)} KM`, 
      context: processed.totalDistance > 50 ? "Marathon distance achieved!" : "Keep pushing forward",
      gradient: "from-purple-primary to-pink-primary",
      icon: Ruler
    },
    { 
      label: "TOTAL TIME", 
      value: `${processed.totalTime.toFixed(1)} HRS`, 
      context: processed.totalTime > 10 ? "That's dedication!" : "Time well spent",
      gradient: "from-pink-primary to-blue-primary",
      icon: Clock
    },
    { 
      label: "TOTAL RUNS", 
      value: String(activities.length), 
      context: activities.length > 20 ? "You chose pain over Netflix" : "Building the habit",
      gradient: "from-blue-primary to-cyan-accent",
      icon: Activity
    },
    { 
      label: "AVG PACE", 
      value: `${formatPace(processed.avgPace)}/km`, 
      context: "Your signature speed",
      gradient: "from-lime-accent to-yellow-500",
      icon: Zap
    },
  ];

  const insights = [
    {
      title: "🏆 ACHIEVEMENTS",
      content: `Longest run: ${processed.prs?.longestRun ? (processed.prs.longestRun.distance / 1000).toFixed(1) : '0'} km`,
      detail: "Keep pushing your limits!"
    },
    {
      title: "⚡ PACE MASTER",
      content: `Fastest: ${processed.prs?.fastestPaceRun ? formatPace((processed.prs.fastestPaceRun.moving_time / 60) / (processed.prs.fastestPaceRun.distance / 1000)) : '-'}/km`,
      detail: "Speed demon status unlocked"
    },
    {
      title: "🏔️ ELEVATION",
      content: `Total climb: ${processed.prs?.mostElevation ? Math.round(processed.prs.mostElevation.total_elevation_gain) : '0'} m`,
      detail: "Conquering the heights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-base to-navy-dark">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-white font-heading text-2xl tracking-wider bg-gradient-to-r from-purple-primary to-pink-primary bg-clip-text text-transparent">
            STRAVAWRAPPED
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/dashboard" className="text-white uppercase text-sm tracking-widest hover:text-lime-accent transition-colors duration-200 font-semibold">Dashboard</a>
            <a href="/cards" className="text-white/60 uppercase text-sm tracking-widest hover:text-lime-accent transition-colors duration-200">Cards</a>
            <a href="/roast" className="text-white/60 uppercase text-sm tracking-widest hover:text-lime-accent transition-colors duration-200">Roast</a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-primary to-pink-primary flex items-center justify-center text-white font-bold">
              {userName[0]}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="pt-16">
        <div className="relative h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-primary/20 via-pink-primary/20 to-blue-primary/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
              YOUR RUNNING STORY
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-medium">
              {userName}'s Journey Through {processed.totalDistance.toFixed(1)} Kilometers
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-3 space-y-6">
              {/* PROFILE CARD */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-primary to-pink-primary flex items-center justify-center text-3xl font-bold mb-4">
                    {userName[0]}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{userName}</h3>
                  <div className="flex items-center gap-1 text-sm text-white/60">
                    <MapPin className="w-4 h-4" />
                    {userCity}
                  </div>
                </div>
              </Card>

              {/* QUICK STATS */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white">
                <h3 className="text-sm uppercase tracking-wider text-white/60 mb-4">QUICK STATS</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold">{processed.totalDistance.toFixed(1)}</div>
                    <div className="text-sm text-white/60">Total Kilometers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{activities.length}</div>
                    <div className="text-sm text-white/60">Total Runs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{processed.totalTime.toFixed(1)}</div>
                    <div className="text-sm text-white/60">Hours Moving</div>
                  </div>
                </div>
              </Card>

              {/* PERSONA CARD */}
              <Card className={`bg-gradient-to-br ${persona.color} p-6 text-white border-0`}>
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-8 h-8" />
                  <h3 className="text-lg font-bold">YOUR PERSONA</h3>
                </div>
                <div className="text-2xl font-black mb-2">{persona.title}</div>
                <div className="text-sm opacity-90">{persona.desc}</div>
              </Card>

              {/* QUICK ACTIONS */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 space-y-3">
                <Button className="w-full bg-gradient-to-r from-lime-accent to-cyan-accent text-black font-bold hover:opacity-90">
                  GENERATE CARD
                </Button>
                <Button className="w-full bg-gradient-to-r from-pink-accent to-purple-primary text-white font-bold hover:opacity-90">
                  GET ROASTED 🔥
                </Button>
              </Card>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-6 space-y-6">
              {/* WHO ARE YOU */}
              <Card className="bg-gradient-to-r from-purple-primary/20 to-pink-primary/20 backdrop-blur-xl border-white/10 p-8 text-white">
                <h2 className="text-3xl font-black mb-4">WHO ARE YOU?</h2>
                <div className="space-y-2 text-lg">
                  <p>You're a <span className="text-lime-accent font-bold">{persona.title}</span></p>
                  <p>You own the streets of <span className="text-cyan-accent font-bold">{userCity.toUpperCase()}</span></p>
                  <p>You started your journey <span className="text-pink-primary font-bold">{activities.length > 0 ? 'some time ago' : 'recently'}</span></p>
                </div>
              </Card>

              {/* THE NUMBERS (BUT FUN) */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6">THE NUMBERS (BUT FUN)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {funStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <Card 
                        key={idx}
                        className={`bg-gradient-to-br ${stat.gradient} p-6 text-white border-0 hover:scale-105 transition-transform duration-200`}
                      >
                        <Icon className="w-8 h-8 mb-3" />
                        <div className="text-4xl font-black mb-2">{stat.value}</div>
                        <div className="text-xs uppercase tracking-wider opacity-90 mb-1">{stat.label}</div>
                        <div className="text-sm opacity-80">{stat.context}</div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* THE PLOT TWISTS */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6">THE PLOT TWISTS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, idx) => (
                    <Card key={idx} className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white hover:bg-white/10 transition-colors">
                      <h3 className="text-lg font-bold mb-2">{insight.title}</h3>
                      <div className="text-2xl font-bold text-lime-accent mb-2">{insight.content}</div>
                      <div className="text-sm text-white/60">{insight.detail}</div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* HIGHLIGHT REEL */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6">HIGHLIGHT REEL</h2>
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity, idx) => (
                    <Card key={idx} className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold">{activity.name || 'Run'}</h3>
                        <Award className="w-6 h-6 text-lime-accent" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{((activity.distance || 0) / 1000).toFixed(1)}</div>
                          <div className="text-xs text-white/60">KM</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{new Date(activity.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-white/60">DATE</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{activity.kudos_count || 0}</div>
                          <div className="text-xs text-white/60">KUDOS</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-3 space-y-6">
              {/* LIVE STATS */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white">
                <h3 className="text-sm uppercase tracking-wider text-white/60 mb-4">RIGHT NOW</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <span className="text-xl font-bold">{activities.filter(a => {
                      const date = new Date(a.start_date_local);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return date > weekAgo;
                    }).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="text-xl font-bold">{activities.filter(a => {
                      const date = new Date(a.start_date_local);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return date > monthAgo;
                    }).length}</span>
                  </div>
                </div>
              </Card>

              {/* CHALLENGES */}
              <Card className="bg-gradient-to-br from-pink-primary to-purple-primary p-6 text-white border-0">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6" />
                  <h3 className="text-lg font-bold">YOUR NEXT GOAL</h3>
                </div>
                <div className="text-center mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full border-8 border-white/20 flex items-center justify-center mb-3">
                    <div className="text-3xl font-black">{Math.round((processed.totalDistance / 50) * 100)}%</div>
                  </div>
                  <div className="text-sm">{(50 - processed.totalDistance).toFixed(1)} km to 50K Club</div>
                </div>
              </Card>

              {/* LOCAL RANKING */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-lg font-bold">LOCAL RANKING</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-lime-accent mb-2">#23</div>
                  <div className="text-sm text-white/60">in {userCity.toUpperCase()}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
