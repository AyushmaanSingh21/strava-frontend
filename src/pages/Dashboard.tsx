import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, Mountain, Activity, Clock, Ruler, Flame } from "lucide-react";

const Dashboard = () => {
  const userName = "ALEX";
  
  const heroStats = [
    { label: "TOTAL DISTANCE", value: "247.3 KM", subtext: "this month", icon: Ruler, color: "lime" },
    { label: "TOTAL TIME", value: "24.5 HRS", subtext: "moving time", icon: Clock, color: "pink" },
    { label: "ACTIVITIES", value: "18", subtext: "runs logged", icon: Activity, color: "blue" },
    { label: "AVG PACE", value: "5:23 /km", subtext: "average pace", icon: Zap, color: "yellow" },
  ];

  const recentActivities = [
    { name: "Morning Run", distance: "8.2 km", pace: "5:12 /km", date: "Today" },
    { name: "Evening Ride", distance: "24.5 km", pace: "3:45 /km", date: "Yesterday" },
    { name: "Trail Run", distance: "12.3 km", pace: "6:03 /km", date: "2 days ago" },
    { name: "Recovery Run", distance: "5.0 km", pace: "6:30 /km", date: "3 days ago" },
    { name: "Long Run", distance: "21.1 km", pace: "5:45 /km", date: "4 days ago" },
  ];

  const personalRecords = [
    { label: "Longest Run", value: "21.5 km", icon: Trophy },
    { label: "Fastest 5K", value: "24:32", icon: Zap },
    { label: "Most Elevation", value: "523m", icon: Mountain },
  ];

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const weekActivity = [true, false, true, true, false, true, true];

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
              {heroStats.map((stat, index) => (
                <Card 
                  key={index}
                  className={`bg-black text-white border-2 border-white ${getBorderColor(stat.color)} border-l-8 shadow-brutal hover:translate-y-[-4px] transition-transform duration-200 p-6`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="font-mono text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.subtext}
                  </div>
                </Card>
              ))}
            </div>

            {/* Quirky message */}
            <div className="mt-8 text-center">
              <p className="text-lime font-bold text-lg">
                18 activities? Someone's training for something 👀
              </p>
            </div>
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
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`p-4 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} border-l-2 border-lime hover:border-l-4 transition-all`}
                    >
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
                  {personalRecords.map((record, index) => (
                    <div key={index} className="border-l-4 border-pink pl-4 hover:border-l-8 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <record.icon className="w-5 h-5 text-yellow" />
                        <div className="text-sm uppercase tracking-wide text-gray-400">
                          {record.label}
                        </div>
                      </div>
                      <div className="font-mono text-3xl font-bold">
                        {record.value}
                      </div>
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
                  <div className="text-sm text-gray-400 uppercase mt-2">in NEW YORK</div>
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
              Last synced: 2 mins ago
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
