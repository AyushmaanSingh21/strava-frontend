interface TornEdgeProps {
  color?: string;
}

const TornEdge = ({ color = "#ffffff" }: TornEdgeProps) => {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
      <svg
        className="relative block w-full h-8 md:h-12"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 Q30,45 60,25 T120,25 Q150,5 180,25 T240,25 Q270,50 300,25 T360,25 Q390,10 420,25 T480,25 Q510,40 540,25 T600,25 Q630,15 660,25 T720,25 Q750,35 780,25 T840,25 Q870,20 900,25 T960,25 Q990,30 1020,25 T1080,25 Q1110,18 1140,25 L1200,25 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default TornEdge;
