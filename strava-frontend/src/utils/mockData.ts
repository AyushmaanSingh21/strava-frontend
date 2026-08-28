/**
 * Mock data mode for local UI development.
 * Activate by adding ?mock to the URL (e.g. http://localhost:8080/dashboard?mock)
 * No Strava tokens or backend required.
 *
 * The flag is remembered for the rest of the browser session so in-app
 * navigation (which drops the query string) keeps using mock data.
 * Use ?mock=off to clear it.
 */

export const isMockMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const param = new URLSearchParams(window.location.search).get("mock");
  if (param !== null) {
    if (param === "off") {
      sessionStorage.removeItem("mock_mode");
      return false;
    }
    sessionStorage.setItem("mock_mode", "1");
    return true;
  }
  return sessionStorage.getItem("mock_mode") === "1";
};

// --- Polyline encoding (Google encoded polyline format) ---

const encodePolyline = (points: Array<[number, number]>): string => {
  let result = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const [lat, lng] of points) {
    const ilat = Math.round(lat * 1e5);
    const ilng = Math.round(lng * 1e5);
    for (const val of [ilat - prevLat, ilng - prevLng]) {
      let v = val < 0 ? ~(val << 1) : val << 1;
      while (v >= 0x20) {
        result += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
        v >>= 5;
      }
      result += String.fromCharCode(v + 63);
    }
    prevLat = ilat;
    prevLng = ilng;
  }
  return result;
};

// Seeded PRNG so mock data is stable across reloads
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

// Generate a loop-shaped GPS route around a center point
const makeRoute = (centerLat: number, centerLng: number, radiusDeg: number): string => {
  const points: Array<[number, number]> = [];
  const steps = 40 + Math.floor(rand() * 30);
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const wobble = 1 + (rand() - 0.5) * 0.35;
    points.push([
      centerLat + Math.sin(angle) * radiusDeg * wobble,
      centerLng + Math.cos(angle) * radiusDeg * wobble * 1.4,
    ]);
  }
  return encodePolyline(points);
};

const DELHI_CENTERS: Array<[number, number]> = [
  [28.6139, 77.209],
  [28.5355, 77.391],
  [28.6129, 77.2295],
];

const RUN_NAMES = [
  "Morning Run",
  "Evening Run",
  "Lunch Run",
  "Tempo Tuesday",
  "Track intervals",
  "Garmi mein tempo",
  "RECOVERY RUN",
  "Benefits of speed work",
  "Farewell 10K",
  "Saturday Long Run",
  "Ridge trail loop",
  "Monsoon dash",
  "Sunset shakeout",
  "Race day! Airtel Delhi Half Marathon",
];

interface MockActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  average_speed: number;
  max_speed: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  kudos_count: number;
  average_heartrate: number;
  calories: number;
  map: { summary_polyline: string };
}

const buildActivities = (): MockActivity[] => {
  seed = 42; // reset for determinism
  const activities: MockActivity[] = [];
  let id = 900000;

  // ~110 runs spread across 2025, skipping most of June (vacation dip)
  for (let day = 0; day < 365; day++) {
    const date = new Date(Date.UTC(2025, 0, 1 + day));
    const month = date.getUTCMonth();
    if (month === 5 && day % 6 !== 0) continue; // light June
    const chance = rand();
    if (chance > (month === 11 ? 0.28 : 0.32)) continue;

    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isLongRun = isWeekend && rand() > 0.45;

    // distance in meters
    let distanceKm: number;
    if (isLongRun) distanceKm = 14 + rand() * 8; // 14-22k long runs
    else if (rand() > 0.85) distanceKm = 8 + rand() * 6; // mid-week medium
    else distanceKm = 3.5 + rand() * 4.5; // easy 3.5-8k

    // pace in min/km: 5:05-5:30 fast days, 5:45-6:40 easy
    const paceMinPerKm = isLongRun ? 5.9 + rand() * 0.6 : 5.1 + rand() * 0.9;

    const movingTimeSec = Math.round(distanceKm * paceMinPerKm * 60);
    const elapsed = Math.round(movingTimeSec * (1.04 + rand() * 0.08));

    // run hour: morning bias on weekdays, evening on weekends
    const hour = isWeekend ? 6 + Math.floor(rand() * 3) : rand() > 0.55 ? 6 + Math.floor(rand() * 3) : 18 + Math.floor(rand() * 3);
    date.setUTCHours(hour, Math.floor(rand() * 60));

    const speedMps = 1000 / 60 / paceMinPerKm;
    const name =
      distanceKm > 20 ? pick(["Race day! Airtel Delhi Half Marathon", "Saturday Long Run"]) : pick(RUN_NAMES);

    activities.push({
      id: id++,
      name,
      type: "Run",
      sport_type: "Run",
      distance: Math.round(distanceKm * 1000),
      moving_time: movingTimeSec,
      elapsed_time: elapsed,
      average_speed: speedMps,
      max_speed: speedMps * (1.25 + rand() * 0.3),
      total_elevation_gain: Math.round(15 + rand() * 120),
      start_date: date.toISOString(),
      start_date_local: new Date(date.getTime() + 5.5 * 3600000).toISOString().replace("Z", ""),
      kudos_count: Math.floor(rand() * 30),
      average_heartrate: Math.round(145 + rand() * 30),
      calories: Math.round(distanceKm * 65),
      map: { summary_polyline: makeRoute(...pick(DELHI_CENTERS), 0.004 + rand() * 0.01) },
    });
  }

  return activities.sort(
    (a, b) => new Date(a.start_date_local).getTime() - new Date(b.start_date_local).getTime()
  );
};

export const getMockProfile = () => ({
  id: 12345678,
  username: "mock_runner",
  firstname: "Ayushmaan",
  lastname: "Singh",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  sex: "M",
  created_at: "2021-03-15T08:30:00Z",
  profile: "",
  profile_medium: "",
  follower_count: 128,
  friend_count: 64,
  weight: 70,
});

export const getMockClubs = () => [
  {
    id: 98765,
    name: "Delhi Runners Collective",
    member_count: 1240,
    sport_type: "running",
  },
];

export const getMockActivities = (): MockActivity[] => buildActivities();
