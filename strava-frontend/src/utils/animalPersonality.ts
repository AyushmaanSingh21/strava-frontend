
export interface AnimalTier {
  id: string;
  name: string; // The "Title" e.g. "The Lone Wolf"
  animal: string; // The animal name e.g. "Wolf"
  minPace: number; // min/km (lower is faster)
  minDist: number; // km/week
  desc: string;
  image: string;
  color: string;
}

export const ANIMAL_TIERS: AnimalTier[] = [
  {
    id: 'falcon',
    name: 'The Sky Hunter',
    animal: 'Falcon',
    minPace: 5.0, // Faster than 5:00 min/km (was 4.5)
    minDist: 35, // More than 35km/week (was 50)
    desc: "You don't just run; you soar. High altitude, high speed, absolute dominance.",
    image: "/animals/falcon.png",
    color: "bg-sky-500"
  },
  {
    id: 'cheetah',
    name: 'The Blur of the Savannah',
    animal: 'Cheetah',
    minPace: 6.0, // Faster than 6:00 min/km (was 5.5)
    minDist: 20, // More than 20km/week (was 30)
    desc: "Explosive speed. Minimal wasted movement. You are built for the chase.",
    image: "/animals/cheetah.png",
    color: "bg-yellow-500"
  },
  {
    id: 'wolf',
    name: 'The Lone Wolf',
    animal: 'Wolf',
    minPace: 7.5, // Faster than 7:30 min/km (was 6.5)
    minDist: 10, // More than 10km/week (was 20)
    desc: "Focused. Disciplined. You run your own path, and you never back down.",
    image: "/animals/wolf.png",
    color: "bg-slate-600"
  },
  {
    id: 'dog',
    name: 'The Happy Warrior',
    animal: 'Golden Retriever',
    minPace: 9.0, // Faster than 9:00 min/km (was 7.5)
    minDist: 5, // More than 5km/week (was 10)
    desc: "Energetic, loyal, and always down for a run. You bring the vibes.",
    image: "/animals/dog.png",
    color: "bg-orange-500"
  },
  {
    id: 'turtle',
    name: 'The Wise Sage',
    animal: 'Turtle',
    minPace: 999, // Catch-all
    minDist: 0,
    desc: "Slow, steady, and unstoppable. You know that the race is long, and it's only with yourself.",
    image: "/animals/turtle.png",
    color: "bg-green-600"
  }
];

export const assignAnimal = (avgPace: number, weeklyDist: number): AnimalTier => {
  // Check from highest tier to lowest
  for (const animal of ANIMAL_TIERS) {
    if (animal.id === 'turtle') return animal; // Fallback
    
    if (avgPace <= animal.minPace && weeklyDist >= animal.minDist) {
      return animal;
    }
  }
  
  return ANIMAL_TIERS[ANIMAL_TIERS.length - 1];
};
