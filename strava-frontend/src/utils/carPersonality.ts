
export interface CarTier {
  id: string;
  name: string;
  minPace: number; // min/km (lower is faster)
  minDist: number; // km/week
  desc: string;
  image: string;
  color: string;
}

export const CAR_TIERS: CarTier[] = [
  {
    id: 'ferrari',
    name: 'Ferrari SF90',
    minPace: 4.0, // Faster than 4:00 min/km
    minDist: 60, // More than 60km/week
    desc: "Pure speed. You don't just run; you fly. Catch me if you can.",
    image: "/cars/ferrari.png",
    color: "bg-red-600"
  },
  {
    id: 'porsche',
    name: 'Porsche 911 GT3',
    minPace: 5.0, // Faster than 5:00 min/km
    minDist: 40, // More than 40km/week
    desc: "Precision engineering. You're fast, consistent, and built for performance.",
    image: "/cars/porsche.png",
    color: "bg-yellow-500"
  },
  {
    id: 'bmw',
    name: 'BMW M3',
    minPace: 6.0, // Faster than 6:00 min/km
    minDist: 20, // More than 20km/week
    desc: "The ultimate driving machine. Serious about stats, but still practical for the daily grind.",
    image: "/cars/bmw.png",
    color: "bg-blue-600"
  },
  {
    id: 'swift',
    name: 'Maruti Swift',
    minPace: 7.0, // Faster than 7:00 min/km
    minDist: 10, // More than 10km/week
    desc: "The people's champ. Reliable, efficient, and always ready for a spin.",
    image: "/cars/swift.png",
    color: "bg-orange-500"
  },
  {
    id: 'santro',
    name: 'Hyundai Santro',
    minPace: 999, // Catch-all
    minDist: 0,
    desc: "The legend. You get there eventually, and honestly? That's all that matters.",
    image: "/cars/santro.png",
    color: "bg-green-500"
  }
];

export const assignCar = (avgPace: number, weeklyDist: number): CarTier => {
  // Check from highest tier to lowest
  // Note: Pace is min/km, so LOWER is better/faster.
  // We check if user is FASTER (<= minPace) AND goes FURTHER (>= minDist)
  
  for (const car of CAR_TIERS) {
    if (car.id === 'santro') return car; // Fallback
    
    if (avgPace <= car.minPace && weeklyDist >= car.minDist) {
      return car;
    }
  }
  
  return CAR_TIERS[CAR_TIERS.length - 1];
};
