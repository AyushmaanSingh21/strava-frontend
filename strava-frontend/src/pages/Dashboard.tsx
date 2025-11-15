import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame, Award, TrendingUp, MapPin, Target } from "lucide-react";
import { getAthleteProfile, getActivities } from "@/services/stravaAPI";
import RunMapViz from "@/components/RunMapViz";
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const prof = await getAthleteProfile();
        setProfile(prof || null);
        const acts = (await getActivities(1, 50)) || [];
        setActivities(Array.isArray(acts) ? acts : []);
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

  // Detect runner persona
  const detectPersona = () => {
    if (activities.length === 0) return { title: "BEGINNER", desc: "Your journey starts here", color: "from-[#2F71FF] to-[#1a4fd6]" };
    
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
    if (eveningRuns / activities.length > 0.6) return { title: "EVENING WARRIOR", desc: "Sunset is your time", color: "from-purple-600 to-[#FF006E]" };
    if (weekendRuns / activities.length > 0.7) return { title: "WEEKEND WARRIOR", desc: "Weekends are for running", color: "from-[#ccff00] to-cyan-400" };
    return { title: "CONSISTENT LEGEND", desc: "Reliable and strong", color: "from-[#2F71FF] to-purple-600" };
  };

  const persona = detectPersona();

  const heroStats = [
    { 
      label: "TOTAL DISTANCE", 
      value: `${processed.totalDistance.toFixed(1)} KM`, 
      subtext: processed.totalDistance > 50 ? "Marathon territory!" : "last 50 activities",
      icon: Ruler, 
      gradient: "from-purple-600 to-[#FF006E]"
    },
    { 
      label: "TOTAL TIME", 
      value: `${processed.totalTime.toFixed(1)} HRS`, 
      subtext: processed.totalTime > 10 ? "That's dedication!" : "moving time",
      icon: Clock, 
      gradient: "from-[#FF006E] to-[#2F71FF]"
    },
    { 
      label: "TOTAL RUNS", 
      value: String(activities.length || 0), 
      subtext: activities.length > 20 ? "Pain > Netflix" : "logged",
      icon: Activity, 
      gradient: "from-[#2F71FF] to-cyan-400"
    },
    { 
      label: "AVG PACE", 
      value: formatPace(processed.avgPace), 
      subtext: "your signature speed",
      icon: Zap, 
      gradient: "from-[#ccff00] to-yellow-500"
    },
  ];

  const recentActivities = activities.slice(0, 10).map((a) => {
    const km = (a?.distance || 0) / 1000;
    const paceMinPerKm = a?.type === "Run" && km > 0 ? (a.moving_time / 60) / km : null;
    return {
      name: a?.name || "Activity",
      distance: `${km.toFixed(1)} km`,
      pace: a?.type === "Run" && paceMinPerKm ? formatPace(paceMinPerKm) : "-",
      date: a?.start_date_local ? new Date(a.start_date_local).toLocaleDateString() : "",
    };
  });

  const personalRecords = [
    { label: "Longest Run", value: processed.prs?.longestRun ? `${(processed.prs.longestRun.distance / 1000).toFixed(1)} km` : "-", icon: Trophy },
    { label: "Fastest Pace", value: processed.prs?.fastestPaceRun ? formatPace((processed.prs.fastestPaceRun.moving_time / 60) / (processed.prs.fastestPaceRun.distance / 1000)) : "-", icon: Zap },
    { label: "Most Elevation", value: processed.prs?.mostElevation ? `${Math.round(processed.prs.mostElevation.total_elevation_gain)} m` : "-", icon: Mountain },
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const weekActivity = (() => {
    const now = new Date();
    return weekDays.map((_, idx) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - idx));
      const dayKey = day.toISOString().slice(0, 10);
      return activities.some((a) => (a.start_date || a.start_date_local || "").slice(0, 10) === dayKey);
    });
  })();

  const thisWeekCount = activities.filter(a => {
    const date = new Date(a.start_date_local);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  const thisMonthCount = activities.filter(a => {
    const date = new Date(a.start_date_local);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return date > monthAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="bg-gradient-to-r from-[#2F71FF] to-[#FF006E] bg-clip-text text-transparent font-heading text-2xl tracking-wider font-bold">
            STRAVAWRAPPED
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/dashboard" className="text-[#2F71FF] uppercase text-sm tracking-widest font-bold">Dashboard</a>
            <a href="/cards" className="text-gray-600 uppercase text-sm tracking-widest hover:text-[#2F71FF] transition-colors duration-200">Cards</a>
            <a href="/roast" className="text-gray-600 uppercase text-sm tracking-widest hover:text-[#2F71FF] transition-colors duration-200">Roast</a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2F71FF] to-[#FF006E] flex items-center justify-center text-white font-bold">
                {userName[0]}
              </div>
              <span className="text-black font-bold hidden md:block">{userName}</span>
            </div>
            <Button 
              variant="ghost"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 uppercase text-xs tracking-wider font-bold"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* CONTENT (with padding for fixed navbar) */}
      <div className="pt-16">
        {/* HERO BANNER */}
        <section className="relative h-[300px] overflow-hidden bg-gradient-to-br from-[#2F71FF] to-[#1a4fd6]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              YOUR RUNNING STORY
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              {userName}'s Journey Through {processed.totalDistance.toFixed(1)} Kilometers
            </p>
          </div>
        </section>

        {/* HERO STATS */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(loading ? [0,1,2,3] : heroStats).map((stat: any, index: number) => {
                const Icon = (stat as any)?.icon as React.ComponentType<any> | undefined;
                return (
                  <Card 
                    key={index}
                    className={`bg-gradient-to-br ${(stat as any)?.gradient || "from-gray-100 to-gray-200"} text-white border-0 shadow-lg hover:scale-105 transition-all duration-200 p-6`}
                  >
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-8 bg-white/20 rounded" />
                        <div className="h-4 bg-white/20 rounded" />
                        <div className="h-3 bg-white/20 rounded" />
                      </div>
                    ) : (
                      <>
                        {Icon && <Icon className="w-8 h-8 mb-3" />}
                        <div className="font-mono text-4xl font-black mb-2">
                          {(stat as any).value}
                        </div>
                        <div className="text-xs uppercase tracking-wider opacity-90 mb-1">
                          {(stat as any).label}
                        </div>
                        <div className="text-sm opacity-80">
                          {(stat as any).subtext}
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* MAP VISUALIZATION SECTION */}
        {!loading && activities.length > 0 && activities[0]?.map?.summary_polyline && (
          <section className="py-8 bg-gray-900">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-[#2F71FF]" />
                LATEST RUN MAP
              </h2>
              <RunMapViz activity={activities[0]} />
            </div>
          </section>
        )}

        {/* MAIN DASHBOARD GRID */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT SIDEBAR */}
              <div className="lg:col-span-3 space-y-6">
                {/* PROFILE CARD */}
                <Card className="bg-white border-2 border-gray-200 p-6 shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#2F71FF] to-[#FF006E] flex items-center justify-center text-3xl font-bold text-white mb-4">
                      {userName[0]}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{userName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {userCity}
                    </div>
                  </div>
                </Card>

                {/* QUICK STATS */}
                <Card className="bg-white border-2 border-gray-200 p-6 shadow-lg">
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-bold mb-4">QUICK STATS</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-3xl font-bold text-[#2F71FF]">{processed.totalDistance.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Total Kilometers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#2F71FF]">{activities.length}</div>
                      <div className="text-sm text-gray-600">Total Runs</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#2F71FF]">{processed.totalTime.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Hours Moving</div>
                    </div>
                  </div>
                </Card>

                {/* PERSONA CARD */}
                <Card className={`bg-gradient-to-br ${persona.color} p-6 text-white border-0 shadow-lg`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-8 h-8" />
                    <h3 className="text-lg font-bold">YOUR PERSONA</h3>
                  </div>
                  <div className="text-2xl font-black mb-2">{persona.title}</div>
                  <div className="text-sm opacity-90">{persona.desc}</div>
                </Card>

                {/* LIVE STATS */}
                <Card className="bg-white border-2 border-gray-200 p-6 shadow-lg">
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-bold mb-4">RIGHT NOW</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Week</span>
                      <span className="text-2xl font-bold text-[#2F71FF]">{thisWeekCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <span className="text-2xl font-bold text-[#2F71FF]">{thisMonthCount}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="lg:col-span-6 space-y-6">
                {/* RECENT ACTIVITY */}
                <Card className="bg-white text-black border-2 border-gray-200 border-t-[#2F71FF] border-t-4 shadow-lg hover:shadow-xl transition-shadow p-6">
                <h2 className="text-2xl font-heading uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  RECENT ACTIVITY
                </h2>
                <div className="space-y-3">
                  {(loading ? Array.from({ length: 5 }) : recentActivities).map((activity: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-transparent'} border-l-2 border-[#2F71FF] hover:border-l-4 transition-all rounded-md`}
                    >
                      {loading ? (
                        <div className="h-10 bg-white/10" />
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-lg">{activity.name}</div>
                            <div className="text-sm text-gray-400">{activity.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xl font-bold">{activity.distance}</div>
                            <div className="font-mono text-sm text-gray-400">{activity.pace}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

                {/* HIGHLIGHT REEL */}
                <div>
                  <h2 className="text-2xl font-black mb-4">HIGHLIGHT REEL</h2>
                  <div className="space-y-4">
                    {activities.slice(0, 3).map((activity, idx) => (
                      <Card key={idx} className="bg-white border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold">{activity.name || 'Run'}</h3>
                          <Award className="w-6 h-6 text-[#ccff00]" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-[#2F71FF]">{((activity.distance || 0) / 1000).toFixed(1)}</div>
                            <div className="text-xs text-gray-600">KM</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#2F71FF]">{new Date(activity.start_date_local).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div className="text-xs text-gray-600">DATE</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#2F71FF]">{activity.kudos_count || 0}</div>
                            <div className="text-xs text-gray-600">KUDOS</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <Card className="bg-white text-black border-2 border-gray-200 border-t-[#2F71FF] border-t-4 shadow-lg p-6">
                  <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                    QUICK ACTIONS
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      className="bg-gradient-to-r from-[#ccff00] to-cyan-400 text-black hover:opacity-90 font-heading text-lg uppercase tracking-wider h-14 font-bold"
                    >
                      GENERATE CARD
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#FF006E] to-purple-600 text-white hover:opacity-90 font-heading text-lg uppercase tracking-wider h-14 font-bold relative"
                    >
                      GET ROASTED 🔥
                    </Button>
                  </div>
                </Card>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="lg:col-span-3 space-y-6">
                {/* PERSONAL RECORDS */}
                <Card className="bg-white text-black border-2 border-gray-200 border-t-[#FF006E] border-t-4 shadow-lg p-6">
                  <h2 className="text-xl font-heading uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-[#FF006E]" />
                    PERSONAL RECORDS
                  </h2>
                  <div className="space-y-4">
                    {(loading ? Array.from({ length: 3 }) : personalRecords).map((record: any, index: number) => (
                      <div key={index} className="border-l-4 border-[#FF006E] pl-4 bg-gray-50 p-3 rounded-md">
                        {loading ? (
                          <div className="h-10 bg-gray-200 rounded" />
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-2">
                              <record.icon className="w-5 h-5 text-[#FF006E]" />
                              <div className="text-sm uppercase tracking-wide text-gray-600 font-bold">
                                {record.label}
                              </div>
                            </div>
                            <div className="font-mono text-2xl font-bold text-[#2F71FF]">
                              {record.value}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* THIS WEEK */}
                <Card className="bg-white text-black border-2 border-gray-200 border-t-[#2F71FF] border-t-4 shadow-lg p-6">
                  <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                    THIS WEEK
                  </h2>
                  <div className="flex justify-between items-center mb-6">
                    {weekDays.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold">{day}</span>
                        <div 
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${
                            weekActivity[index] 
                              ? 'bg-[#2F71FF] border-[#2F71FF] text-white' 
                              : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}
                        >
                          {weekActivity[index] ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold">3 day streak!</span>
                    </div>
                  </div>
                </Card>

                {/* NEXT GOAL */}
                <Card className="bg-gradient-to-br from-[#FF006E] to-purple-600 p-6 text-white border-0 shadow-lg">
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
                <Card className="bg-white text-black border-2 border-gray-200 border-t-[#2F71FF] border-t-4 shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#2F71FF]" />
                    <h3 className="text-lg font-bold">LOCAL RANKING</h3>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-black text-[#2F71FF] mb-2">#23</div>
                    <div className="text-sm text-gray-600">in {userCity.toUpperCase()}</div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((rank) => (
                      <div key={rank} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-md">
                        <span className="font-mono font-bold text-[#2F71FF]">#{rank}</span>
                        <span className="text-gray-600 text-xs">Runner {rank}</span>
                        <span className="font-mono text-xs">342 km</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Last synced */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <>Last synced: {lastSynced || "just now"}</>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
