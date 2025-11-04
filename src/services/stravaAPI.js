/**
 * Strava API Client (Frontend MVP)
 * All requests include Bearer token from local storage via stravaAuth.
 */

import { getValidAccessToken } from "./stravaAuth";

const BASE_URL = "https://www.strava.com/api/v3";

/**
 * Perform an authenticated GET request to Strava API
 * @param {string} path e.g. "/athlete"
 * @returns {Promise<any|null>} JSON or null on failure
 */
const authGet = async (path) => {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      console.error("Missing or invalid Strava token");
      return null;
    }
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Strava API error", response.status, text);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Strava API request failed", error);
    return null;
  }
};

/**
 * Get athlete profile
 * GET /athlete
 */
export const getAthleteProfile = async () => {
  return await authGet("/athlete");
};

/**
 * Get athlete lifetime stats
 * GET /athletes/{id}/stats
 * @param {number|string} athleteId
 */
export const getAthleteStats = async (athleteId) => {
  if (!athleteId) return null;
  return await authGet(`/athletes/${athleteId}/stats`);
};

/**
 * Get recent activities
 * GET /athlete/activities
 * @param {number} page
 * @param {number} perPage
 */
export const getActivities = async (page = 1, perPage = 30) => {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  return await authGet(`/athlete/activities?${params.toString()}`);
};

/**
 * Get activity by id
 * GET /activities/{id}
 * @param {number|string} activityId
 */
export const getActivityById = async (activityId) => {
  if (!activityId) return null;
  return await authGet(`/activities/${activityId}`);
};

export default {
  getAthleteProfile,
  getAthleteStats,
  getActivities,
  getActivityById,
};


