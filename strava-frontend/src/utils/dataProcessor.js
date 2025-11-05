/**
 * Utility functions to process Strava activity data
 */

/**
 * Sum all activity distances in kilometers
 * @param {Array<any>} activities
 * @returns {number}
 */
export const calculateTotalDistance = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;
  const meters = activities.reduce((sum, a) => sum + (Number(a?.distance) || 0), 0);
  return +(meters / 1000).toFixed(2);
};

/**
 * Sum all moving_time in hours
 * @param {Array<any>} activities
 * @returns {number}
 */
export const calculateTotalTime = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;
  const seconds = activities.reduce((sum, a) => sum + (Number(a?.moving_time) || 0), 0);
  return +(seconds / 3600).toFixed(2);
};

/**
 * Calculate average pace (min/km) for runs
 * @param {Array<any>} activities
 * @returns {number|null} minutes per km; null if no runs
 */
export const getAveragePace = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return null;
  const runs = activities.filter((a) => a?.type === "Run");
  if (runs.length === 0) return null;
  const totalMovingSec = runs.reduce((s, a) => s + (Number(a?.moving_time) || 0), 0);
  const totalKm = runs.reduce((s, a) => s + ((Number(a?.distance) || 0) / 1000), 0);
  if (totalKm <= 0) return null;
  const paceMinPerKm = (totalMovingSec / 60) / totalKm;
  return +paceMinPerKm.toFixed(2);
};

/**
 * Find personal records: longest run (by distance), fastest pace (min/km), most elevation gain
 * @param {Array<any>} activities
 * @returns {{ longestRun: any|null, fastestPaceRun: any|null, mostElevation: any|null }}
 */
export const findPersonalRecords = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) {
    return { longestRun: null, fastestPaceRun: null, mostElevation: null };
  }
  const runs = activities.filter((a) => a?.type === "Run");
  const longestRun = runs.length
    ? runs.reduce((best, a) => ((a?.distance || 0) > (best?.distance || 0) ? a : best), runs[0])
    : null;

  const fastestPaceRun = runs.length
    ? runs
        .filter((a) => (a?.distance || 0) > 0 && (a?.moving_time || 0) > 0)
        .map((a) => ({ ...a, pace: (a.moving_time / 60) / (a.distance / 1000) }))
        .reduce((best, a) => (a.pace < (best?.pace ?? Infinity) ? a : best), null)
    : null;

  const mostElevation = activities.length
    ? activities.reduce(
        (best, a) => ((a?.total_elevation_gain || 0) > (best?.total_elevation_gain || 0) ? a : best),
        activities[0]
      )
    : null;

  return { longestRun, fastestPaceRun, mostElevation };
};

/**
 * Group activities by month with totals (distance km, time hours, elevation m, count)
 * @param {Array<any>} activities
 * @returns {Array<{ month: string, totalKm: number, totalHours: number, totalElevation: number, count: number }>} chronologically sorted
 */
export const getMonthlyStats = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return [];
  const buckets = new Map();

  for (const a of activities) {
    const start = a?.start_date || a?.start_date_local;
    const date = start ? new Date(start) : null;
    if (!date) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const entry = buckets.get(key) || { totalMeters: 0, totalSec: 0, totalElevation: 0, count: 0 };
    entry.totalMeters += Number(a?.distance) || 0;
    entry.totalSec += Number(a?.moving_time) || 0;
    entry.totalElevation += Number(a?.total_elevation_gain) || 0;
    entry.count += 1;
    buckets.set(key, entry);
  }

  const rows = Array.from(buckets.entries()).map(([month, v]) => ({
    month,
    totalKm: +(v.totalMeters / 1000).toFixed(2),
    totalHours: +(v.totalSec / 3600).toFixed(2),
    totalElevation: +v.totalElevation.toFixed(0),
    count: v.count,
  }));

  // sort chronologically
  rows.sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0));
  return rows;
};

/**
 * Count activities by type
 * @param {Array<any>} activities
 * @returns {Record<string, number>}
 */
export const getActivityTypes = (activities) => {
  const counts = {};
  if (!Array.isArray(activities) || activities.length === 0) return counts;
  for (const a of activities) {
    const type = a?.type || "Unknown";
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
};

export default {
  calculateTotalDistance,
  calculateTotalTime,
  getAveragePace,
  findPersonalRecords,
  getMonthlyStats,
  getActivityTypes,
};


