import { BarChart3, MapPin, Flame, Award, TrendingUp, Zap } from "lucide-react";

const Demo = () => {
  const floatingEmojis = ["💪", "🔥", "😤", "⚡", "🏃"];
  
  return (
    <section id="demo" className="py-24 bg-white grid-pattern relative overflow-hidden">
      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl float-emoji opacity-30"
            style={{
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-black font-heading text-7xl md:text-8xl text-center mb-16">
          WATCH IT RUN
        </h2>
        
        {/* Bento Box Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4">
          {/* Large Center Video */}
          <div className="col-span-12 md:col-span-8 md:row-span-2 border-4 border-black shadow-brutal-lg bg-black overflow-hidden group hover:-translate-y-1 hover:shadow-lime transition-all duration-200">
            <div className="aspect-video flex items-center justify-center text-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-lime/20 to-hot-pink/20" />
              <div className="relative z-10 text-center">
                <Award className="w-24 h-24 mx-auto mb-4 text-lime animate-pulse" />
                <p className="font-heading text-3xl">VIDEO DEMO</p>
                <p className="font-mono text-sm mt-2 opacity-70">Dashboard in Action</p>
              </div>
            </div>
          </div>
          
          {/* Small Card 1 */}
          <div className="col-span-6 md:col-span-4 border-2 border-black shadow-brutal bg-white p-4 hover:-translate-y-1 hover:border-lime hover:shadow-lime transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-lime" />
              <span className="text-xs font-body uppercase opacity-60">Total Distance</span>
            </div>
            <div className="font-mono text-3xl font-bold">342.8 KM</div>
          </div>
          
          {/* Small Card 2 */}
          <div className="col-span-6 md:col-span-4 border-2 border-black shadow-brutal bg-white p-4 hover:-translate-y-1 hover:border-hot-pink hover:shadow-pink transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-hot-pink" />
              <span className="text-xs font-body uppercase opacity-60">7 Day Streak</span>
            </div>
            <div className="font-mono text-3xl font-bold text-hot-pink">7 DAYS</div>
          </div>
          
          {/* Small Card 3 */}
          <div className="col-span-6 md:col-span-4 border-2 border-black shadow-brutal bg-white p-4 hover:-translate-y-1 hover:border-electric-blue hover:shadow-blue transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-electric-blue" />
              <span className="text-xs font-body uppercase opacity-60">Local Rank</span>
            </div>
            <div className="font-mono text-3xl font-bold text-electric-blue">#23</div>
          </div>
          
          {/* Small Card 4 */}
          <div className="col-span-6 md:col-span-4 border-2 border-black shadow-brutal bg-white p-4 hover:-translate-y-1 hover:border-achievement-gold hover:shadow-brutal transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-achievement-gold" />
              <span className="text-xs font-body uppercase opacity-60">Avg Pace</span>
            </div>
            <div className="font-mono text-3xl font-bold">5:24 /KM</div>
          </div>
          
          {/* Small Card 5 - Chart */}
          <div className="col-span-12 md:col-span-4 border-2 border-black shadow-brutal bg-white p-4 hover:-translate-y-1 hover:border-lime hover:shadow-lime transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-lime" />
              <span className="text-xs font-body uppercase opacity-60">Weekly Progress</span>
            </div>
            <div className="flex items-end justify-between h-16 gap-1">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-lime transition-all duration-300 hover:bg-hot-pink"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Notification Cards */}
        <div className="max-w-6xl mx-auto mt-8 flex flex-wrap gap-4 justify-center">
          <div className="border-2 border-achievement-gold bg-black px-4 py-2 shadow-brutal animate-snap-in">
            <span className="text-achievement-gold font-mono text-sm">🏆 New PR! +50 kudos</span>
          </div>
          <div className="border-2 border-hot-pink bg-black px-4 py-2 shadow-brutal animate-snap-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-hot-pink font-mono text-sm">🔥 7 day streak maintained</span>
          </div>
          <div className="border-2 border-lime bg-black px-4 py-2 shadow-brutal animate-snap-in" style={{ animationDelay: '0.4s' }}>
            <span className="text-lime font-mono text-sm">⚡ Fastest 5K this month</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
