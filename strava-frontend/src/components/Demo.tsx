import { Sparkles, Brain, TrendingUp } from "lucide-react";
import dashboardImage from "@/assets/dashboard-demo.png";

const Demo = () => {
  const allFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your running patterns, identifying strengths and areas for improvement with precision insights.",
      color: "lime",
      number: "01"
    },
    {
      icon: Sparkles,
      title: "Smart Insights",
      description: "Get personalized recommendations based on your training data. Our AI learns from your activities to provide tailored guidance.",
      color: "hot-pink",
      number: "02"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Track your progress over time with detailed metrics and visualizations that help you understand your athletic journey.",
      color: "electric-blue",
      number: "03"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Access comprehensive statistics instantly. Monitor pace, distance, elevation, and more with our intelligent dashboard.",
      color: "achievement-gold",
      number: "04"
    }
  ];
  
  return (
    <section id="demo" className="py-24 relative" style={{ backgroundColor: '#2F71FF' }}>
      <div className="container mx-auto px-6">
          
          <h2 className="text-white font-heading text-5xl md:text-7xl text-center mb-12">
            DASHBOARD PREVIEW
          </h2>
          
          {/* Dashboard Image */}
          <div className="flex justify-center mb-12">
            <div className="relative max-w-4xl w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-lime via-hot-pink to-electric-blue rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
              <img 
                src={dashboardImage} 
                alt="Dashboard Preview" 
                className="relative rounded-2xl shadow-2xl w-full h-auto border-4 border-white/20"
              />
            </div>
          </div>
          
          {/* Features Grid - Similar to Features Section */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`bg-white border-[3px] border-${feature.color} p-8 relative hover:scale-[1.02] transition-transform duration-200 group shadow-brutal`}
                >
                  {/* Corner Number */}
                  <div className={`absolute top-4 right-4 text-${feature.color} font-mono text-sm opacity-50`}>
                    {feature.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className={`w-16 h-16 text-${feature.color}`} strokeWidth={1.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-black font-heading text-3xl mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-black/80 font-body text-base leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Diagonal Accent Line */}
                  <div 
                    className={`absolute bottom-0 right-0 w-16 h-16 bg-${feature.color} opacity-10`}
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />
                </div>
              );
            })}
          </div>
          
          <p className="text-center text-white/80 font-body text-sm mt-12 max-w-3xl mx-auto">
            Experience the power of AI-driven analytics combined with beautiful, intuitive design. Transform your Strava data into actionable insights.
          </p>
      </div>
    </section>
  );
};

export default Demo;
