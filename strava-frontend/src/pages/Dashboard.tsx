import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame } from "lucide-react";
import { getAthleteProfile, getActivities } from "@/services/stravaAPI";
import {
  calculateTotalDistance,
  calculateTotalTime,
  getAveragePace,
  findPersonalRecords,
  getMonthlyStats,
  getActivityTypes,
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
    const monthly = getMonthlyStats(activities);
    const byType = getActivityTypes(activities);
    return { totalDistance, totalTime, avgPace, prs, monthly, byType };
  }, [activities]);

  const userName = profile?.firstname ? String(profile.firstname).toUpperCase() : "ATHLETE";

  const heroStats = [
    { label: "TOTAL DISTANCE", value: `${processed.totalDistance.toFixed(1)} KM`, subtext: "last 50 activities", icon: Ruler, color: "lime" },
    { label: "TOTAL TIME", value: `${processed.totalTime.toFixed(1)} HRS`, subtext: "moving time", icon: Clock, color: "pink" },
    { label: "ACTIVITIES", value: String(activities.length || 0), subtext: "logged", icon: Activity, color: "blue" },
    { label: "AVG PACE", value: formatPace(processed.avgPace), subtext: "runs only", icon: Zap, color: "yellow" },
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

  const getBorderColor = (color: string) => {
    switch (color) {
      case "lime": return "border-l-lime";
      case "pink": return "border-l-pink";
      case "blue": return "border-l-blue";
      case "yellow": return "border-l-yellow";
      default: return "border-l-lime";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white h-16">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="text-white font-heading text-2xl tracking-wider">
            STRAVAWRAPPED
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/dashboard" className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200 font-semibold">
              Dashboard
            </a>
            <a href="#cards" className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200">
              Cards
            </a>
            <a href="#roast" className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200">
              Roast
            </a>
            <a href="#settings" className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200">
              Settings
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-black font-bold">
                {userName[0]}
              </div>
              <span className="text-white font-bold hidden md:block">{userName}</span>
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
        {/* HERO STATS SECTION */}
        <section className="bg-black border-b-4 border-white py-12">
          <div className="container mx-auto px-6">
            <h1 className="text-white font-heading text-6xl md:text-8xl mb-12 tracking-wider">
              WHAT'S UP, <span className="text-lime">{userName}</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(loading ? [0,1,2,3] : heroStats).map((stat: any, index: number) => {
                const Icon = (stat as any)?.icon as React.ComponentType<any> | undefined;
                return (
                  <Card 
                    key={index}
                    className={`bg-black text-white border-2 border-white ${getBorderColor((stat as any)?.color || "lime")} border-l-8 shadow-brutal hover:translate-y-[-4px] transition-transform duration-200 p-6`}
                  >
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-8 bg-white/10" />
                        <div className="h-4 bg-white/10" />
                        <div className="h-3 bg-white/10" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          {Icon ? <Icon className="w-8 h-8" /> : <div className="w-8 h-8" />}
                        </div>
                        <div className="font-mono text-5xl font-bold mb-2">
                          {(stat as any).value}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                          {(stat as any).label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(stat as any).subtext}
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Quirky message */}
            {!loading && (
              <div className="mt-8 text-center">
                <p className="text-lime font-bold text-lg">
                  {activities.length >= 10
                    ? `${activities.length} activities? Someone's training for something 👀`
                    : activities.length === 0
                    ? "You ran 0x this week. Touch grass more."
                    : `${activities.length} recent activities — keep going!`}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* MAIN DASHBOARD GRID */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ROW 1 */}
              {/* RECENT ACTIVITY - 2/3 width */}
              <Card className="lg:col-span-2 bg-black text-white border-2 border-white border-t-lime border-t-4 shadow-brutal p-6">
                <h2 className="text-2xl font-heading uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  RECENT ACTIVITY
                </h2>
                <div className="space-y-3">
                  {(loading ? Array.from({ length: 5 }) : recentActivities).map((activity: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} border-l-2 border-lime hover:border-l-4 transition-all`}
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

              {/* PERSONAL RECORDS - 1/3 width */}
              <Card className="bg-black text-white border-2 border-white border-t-pink border-t-4 shadow-brutal p-6">
                <h2 className="text-2xl font-heading uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-pink" />
                  PERSONAL RECORDS
                </h2>
                <div className="space-y-6">
                  {(loading ? Array.from({ length: 3 }) : personalRecords).map((record: any, index: number) => (
                    <div key={index} className="border-l-4 border-pink pl-4 hover:border-l-8 transition-all">
                      {loading ? (
                        <div className="h-10 bg-white/10" />
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-2">
                            <record.icon className="w-5 h-5 text-yellow" />
                            <div className="text-sm uppercase tracking-wide text-gray-400">
                              {record.label}
                            </div>
                          </div>
                          <div className="font-mono text-3xl font-bold">
                            {record.value}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* ROW 2 */}
              {/* ACTIVITY BREAKDOWN */}
              <Card className="bg-black text-white border-2 border-white border-t-blue border-t-4 shadow-brutal p-6">
                <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                  ACTIVITY BREAKDOWN
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm uppercase">Run</span>
                      <span className="font-mono font-bold">75%</span>
                    </div>
                    <div className="h-4 bg-white/10 relative">
                      <div className="absolute top-0 left-0 h-full bg-lime" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm uppercase">Ride</span>
                      <span className="font-mono font-bold">25%</span>
                    </div>
                    <div className="h-4 bg-white/10 relative">
                      <div className="absolute top-0 left-0 h-full bg-pink" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* MONTHLY PROGRESS */}
              <Card className="bg-black text-white border-2 border-white border-t-yellow border-t-4 shadow-brutal p-6">
                <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                  MONTHLY PROGRESS
                </h2>
                <div className="h-32 flex items-end gap-2">
                  {[45, 62, 58, 78, 85, 72].map((height, index) => (
                    <div 
                      key={index} 
                      className="flex-1 bg-lime hover:bg-yellow transition-colors"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span>JUN</span>
                </div>
              </Card>

              {/* THIS WEEK */}
              <Card className="bg-black text-white border-2 border-white border-t-pink border-t-4 shadow-brutal p-6">
                <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                  THIS WEEK
                </h2>
                <div className="flex justify-between items-center">
                  {weekDays.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-3">
                      <span className="text-sm font-bold">{day}</span>
                      <div 
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          weekActivity[index] 
                            ? 'bg-lime border-lime text-black' 
                            : 'bg-gray-800 border-gray-600 text-gray-600'
                        }`}
                      >
                        {weekActivity[index] ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">3 day streak!</span>
                  </div>
                </div>
              </Card>

              {/* ROW 3 */}
              {/* QUICK ACTIONS */}
              <Card className="lg:col-span-2 bg-black text-white border-2 border-white shadow-brutal p-6">
                <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                  QUICK ACTIONS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="bg-lime text-black hover:bg-lime/90 font-heading text-xl uppercase tracking-wider h-16 shadow-brutal border-2 border-black hover:translate-y-[-2px] transition-transform"
                  >
                    GENERATE CARD
                  </Button>
                  <Button 
                    className="bg-pink text-white hover:bg-pink/90 font-heading text-xl uppercase tracking-wider h-16 shadow-brutal border-2 border-black hover:translate-y-[-2px] transition-transform relative"
                  >
                    GET ROASTED
                    <span className="absolute -top-2 -right-2 bg-yellow text-black text-xs px-2 py-1 font-bold">
                      🔥 PREMIUM
                    </span>
                  </Button>
                </div>
              </Card>

              {/* LOCAL RANKING */}
              <Card className="bg-black text-white border-2 border-white border-t-blue border-t-4 shadow-brutal p-6">
                <h2 className="text-xl font-heading uppercase tracking-wider mb-6">
                  LOCAL RANKING
                </h2>
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-400 uppercase mb-2">You're</div>
                  <div className="font-mono text-6xl font-bold text-blue">#23</div>
                  <div className="text-sm text-gray-400 uppercase mt-2">in {(profile?.city || "YOUR CITY").toString().toUpperCase()}</div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((rank) => (
                    <div key={rank} className="flex justify-between items-center text-sm bg-white/5 p-2">
                      <span className="font-mono font-bold">#{rank}</span>
                      <span className="text-gray-400">Runner {rank}</span>
                      <span className="font-mono">342 km</span>
                    </div>
                  ))}
                </div>
              </Card>
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
