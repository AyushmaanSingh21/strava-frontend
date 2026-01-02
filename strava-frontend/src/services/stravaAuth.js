/**
 * Strava OAuth 2.0 Authentication Utilities (Frontend MVP)
 *
 * SECURITY NOTE:
 * - This implementation performs the authorization code exchange in the frontend to simplify the MVP.
 * - Do NOT ship this to production as-is. Move the token exchange to a backend or use PKCE.
 *
 * Flow Overview:
 * 1) initiateStravaLogin() redirects the user to Strava's authorize URL to grant access
 * 2) Strava redirects back to our app at VITE_REDIRECT_URI with a temporary `code`
 * 3) handleStravaCallback(code) exchanges the `code` for access/refresh tokens and stores them
 * 4) isAuthenticated() checks token validity; if expired, tries to refresh automatically
 */

const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET; // Frontend-only for MVP; move to server for production
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

const AUTH_URL = "https://www.strava.com/oauth/authorize";
const TOKEN_URL = "https://www.strava.com/oauth/token";
const SCOPES = "activity:read_all,profile:read_all";

const STORAGE_KEY = "strava_auth";

/**
 * Persist auth tokens in localStorage
 * @param {{ access_token: string, refresh_token: string, expires_at: number, athlete?: any }} tokenData
 */
const storeToken = (tokenData) => {
  const payload = {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: tokenData.expires_at, // Unix timestamp (seconds)
    athlete: tokenData.athlete ?? null,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

/**
 * Read auth tokens from localStorage
 * @returns {{ access_token: string, refresh_token: string, expires_at: number, athlete?: any } | null}
 */
export const getStoredToken = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse stored Strava token", error);
    return null;
  }
};

/**
 * Clear auth tokens from localStorage
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Redirect user to Strava authorization page to initiate OAuth flow
 */
export const initiateStravaLogin = () => {
  const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  const params = new URLSearchParams({
    client_id: String(CLIENT_ID ?? ""),
    response_type: "code",
    redirect_uri: String(REDIRECT_URI ?? ""),
    scope: SCOPES,
    approval_prompt: "auto",
    state,
  });
  const url = `${AUTH_URL}?${params.toString()}`;
  window.location.assign(url);
};

/**
 * Exchange authorization code for tokens and store them locally
 * @param {string} code
 * @returns {Promise<boolean>} true if successful
 */
export const handleStravaCallback = async (code) => {
  try {
    const body = new URLSearchParams({
      client_id: String(CLIENT_ID ?? ""),
      client_secret: String(CLIENT_SECRET ?? ""), // WARNING: frontend-only for MVP
      code,
      grant_type: "authorization_code",
      redirect_uri: String(REDIRECT_URI ?? ""),
    });

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Strava token exchange failed", response.status, text);
      return false;
    }

    const data = await response.json();
    // data.expires_at is seconds-since-epoch
    storeToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      athlete: data.athlete ?? null,
    });

    // --- NEW: Track User in Backend ---
    if (data.athlete) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      fetch(`${backendUrl}/api/users/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stravaId: data.athlete.id,
          firstname: data.athlete.firstname,
          lastname: data.athlete.lastname,
          profile: data.athlete.profile
        })
      }).catch(err => console.error("Failed to track user:", err));
    }
    // ----------------------------------

    return true;
  } catch (error) {
    console.error("Error during Strava callback handling", error);
    return false;
  }
};

/**
 * Refresh the access token if expired
 * @returns {Promise<string|null>} fresh access token or null on failure
 */
const refreshAccessToken = async () => {
  const token = getStoredToken();
  if (!token?.refresh_token) return null;

  try {
    const body = new URLSearchParams({
      client_id: String(CLIENT_ID ?? ""),
      client_secret: String(CLIENT_SECRET ?? ""), // WARNING: frontend-only for MVP
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    });

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Strava token refresh failed", response.status, text);
      logout();
      return null;
    }

    const data = await response.json();
    storeToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? token.refresh_token,
      expires_at: data.expires_at,
      athlete: token.athlete ?? null,
    });
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Strava token", error);
    logout();
    return null;
  }
};

/**
 * Determine whether the user is authenticated. If the token is expired, attempt refresh.
 * @returns {Promise<boolean>} true if valid token available
 */
export const isAuthenticated = async () => {
  const token = getStoredToken();
  if (!token?.access_token || !token?.expires_at) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (token.expires_at > nowSec + 30) {
    return true;
  }

  // Try to refresh
  const refreshed = await refreshAccessToken();
  return Boolean(refreshed);
};

/**
 * Get a valid access token, refreshing if necessary
 * @returns {Promise<string|null>}
 */
export const getValidAccessToken = async () => {
  const token = getStoredToken();
  if (!token) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  if (token.expires_at > nowSec + 30) {
    return token.access_token;
  }
  return await refreshAccessToken();
};

export default {
  initiateStravaLogin,
  handleStravaCallback,
  getStoredToken,
  isAuthenticated,
  logout,
  getValidAccessToken,
};


