import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAthleteProfile,
  getAthleteStats,
  getActivities,
  getActivityById,
} from "../services/stravaAPI";
import {
  calculateTotalDistance,
  calculateTotalTime,
  getAveragePace,
  findPersonalRecords,
  getMonthlyStats,
  getActivityTypes,
} from "../utils/dataProcessor";
import {
  isAuthenticated,
  getStoredToken,
  logout,
  initiateStravaLogin,
} from "../services/stravaAuth";

const fmtKm = (m) => (m ? (m / 1000).toFixed(2) : "0.00");
const fmtHours = (sec) => (sec ? (sec / 3600).toFixed(2) : "0.00");
const fmtHMS = (sec) => {
  const s = Math.max(0, Number(sec) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return [h, m, ss].map((v) => String(v).padStart(2, "0")).join(":");
};
const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "");

const Section = ({ title, bg = "bg-gray-50", children, right = null }) => (
  <section className={`${bg} rounded-md border border-gray-200 p-4 mb-6`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {right}
    </div>
    {children}
  </section>
);

const CopyButton = ({ label = "Copy JSON", data }) => (
  <button
    className="text-sm rounded bg-gray-800 text-white px-3 py-1 hover:bg-gray-700"
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(
          typeof data === "string" ? data : JSON.stringify(data, null, 2)
        );
        console.log("Copied to clipboard at:", new Date().toISOString());
      } catch (e) {
        console.error("Clipboard copy failed", e);
      }
    }}
  >
    {label}
  </button>
);

const DataTest = () => {
  const [authStatus, setAuthStatus] = useState({ hasToken: false, isAuthed: false });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [activitiesError, setActivitiesError] = useState("");

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [lastRefreshedAt, setLastRefreshedAt] = useState("");

  const tokenInfo = useMemo(() => getStoredToken(), [authStatus.isAuthed]);

  const refreshAuthStatus = useCallback(async () => {
    const hasToken = Boolean(getStoredToken());
    const isAuthedVal = await isAuthenticated();
    setAuthStatus({ hasToken, isAuthed: isAuthedVal });
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setProfileError("");
    setStatsError("");
    setActivitiesError("");
    setError("");
    setLastRefreshedAt("");

    const token = getStoredToken();
    const tokenPrefix = token?.access_token ? String(token.access_token).slice(0, 10) : "";
    console.group("🧪 DATA TEST FETCH RUN");
    console.log("Started at:", new Date().toISOString());
    console.log("Token present:", Boolean(token));
    console.log("Token prefix (first 10 chars):", tokenPrefix || "<none>");

    if (!token) {
      console.error("NO TOKEN FOUND - Please login again");
      setError("NO TOKEN FOUND - Please login again");
      setLoading(false);
      console.groupEnd();
      return;
    }

    let latestProfile = null;
    try {
      // PROFILE
      console.group("🏃 ATHLETE PROFILE");
      console.log("Calling getAthleteProfile()...");
      console.log("URL:", "https://www.strava.com/api/v3/athlete");
      console.log("Headers:", { Authorization: `Bearer ${tokenPrefix}...` });
      setLoadingProfile(true);
      const prof = await getAthleteProfile();
      console.log("Response:", prof ? "OK" : "null");
      console.log("Raw data:", prof);
      if (!prof) {
        const msg = "Failed to fetch profile";
        console.error(msg);
        setProfileError(msg);
        throw new Error(msg);
      }
      latestProfile = prof;
      setProfile(prof);
      console.log("Profile fetched successfully");
      console.groupEnd();
    } catch (e) {
      console.error("Failed to fetch profile", e);
      setProfileError(e?.message || "Unknown error fetching profile");
    } finally {
      setLoadingProfile(false);
    }

    try {
      // STATS (needs athlete id)
      if (latestProfile?.id) {
        const athleteId = latestProfile.id;
        console.group("📊 ATHLETE STATS");
        console.log("Calling getAthleteStats() with id:", athleteId);
        setLoadingStats(true);
        const st = await getAthleteStats(athleteId);
        console.log("Raw data:", st);
        if (!st) {
          const msg = "Failed to fetch stats";
          console.error(msg);
          setStatsError(msg);
          throw new Error(msg);
        }
        setStats(st);
        console.log("Stats fetched successfully");
        console.groupEnd();
      } else {
        console.warn("Skipping stats fetch: missing athlete id");
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
      setStatsError(e?.message || "Unknown error fetching stats");
    } finally {
      setLoadingStats(false);
    }

    let acts = [];
    try {
      // ACTIVITIES
      console.group("🗂️ RECENT ACTIVITIES (last 30)");
      console.log("Calling getActivities(1, 30)...");
      console.log("URL:", "https://www.strava.com/api/v3/athlete/activities?page=1&per_page=30");
      setLoadingActivities(true);
      acts = (await getActivities(1, 30)) || [];
      console.log("Raw data (array):", acts);
      if (!Array.isArray(acts)) {
        const msg = "Failed to fetch activities";
        console.error(msg);
        setActivitiesError(msg);
        throw new Error(msg);
      }
      setActivities(acts);
      if (acts[0]) {
        console.group("🔎 First activity details via getActivityById");
        const one = await getActivityById(acts[0].id);
        console.log("Raw first activity (detail):", one);
        console.groupEnd();
      }
      console.groupEnd();
    } catch (e) {
      console.error("Failed to fetch activities", e);
      setActivitiesError(e?.message || "Unknown error fetching activities");
    } finally {
      setLoadingActivities(false);
    }

    // DATA PROCESSOR
    try {
      console.group("🧮 DATA PROCESSOR RESULTS");
      console.log("Calculated at:", new Date().toISOString());
      console.log("calculateTotalDistance(km):", calculateTotalDistance(acts));
      console.log("calculateTotalTime(hours):", calculateTotalTime(acts));
      console.log("getAveragePace(min/km):", getAveragePace(acts));
      console.log("findPersonalRecords:", findPersonalRecords(acts));
      console.log("getMonthlyStats:", getMonthlyStats(acts));
      console.log("getActivityTypes:", getActivityTypes(acts));
      console.groupEnd();
    } catch (e) {
      console.error("Processor error", e);
    }

    setLastRefreshedAt(new Date().toLocaleString());
    console.log("Completed at:", new Date().toISOString());
    console.groupEnd();
    setLoading(false);
    refreshAuthStatus();
  }, [profile, refreshAuthStatus]);

  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  useEffect(() => {
    // auto-fetch on mount
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processorResults = useMemo(() => {
    return {
      totalKm: calculateTotalDistance(activities),
      totalHours: calculateTotalTime(activities),
      avgPace: getAveragePace(activities),
      prs: findPersonalRecords(activities),
      monthly: getMonthlyStats(activities),
      byType: getActivityTypes(activities),
    };
  }, [activities]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Strava Data Test</h1>
        <div className="text-sm text-gray-600">{lastRefreshedAt ? `Last refresh: ${lastRefreshedAt}` : null}</div>
        <button
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-900"
          onClick={() => {
            // Clear and refetch all
            setProfile(null);
            setStats(null);
            setActivities([]);
            setProfileError("");
            setStatsError("");
            setActivitiesError("");
            fetchAll();
          }}
        >
          REFRESH ALL DATA
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={fetchAll}
          disabled={loading}
        >
          {loading ? "Fetching…" : "Refresh All"}
        </button>
        <button
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          onClick={refreshAuthStatus}
        >
          Check Token Status
        </button>
        <button
          className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          onClick={() => {
            logout();
            refreshAuthStatus();
          }}
        >
          Clear Token
        </button>
        <button
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          onClick={initiateStravaLogin}
        >
          Re-authenticate
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <Section
        title="Auth Status"
        bg="bg-blue-50"
        right={<CopyButton label="Copy Token JSON" data={tokenInfo || {}} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded bg-white p-3 border">
            <div className="font-medium">Has Token</div>
            <div>{String(authStatus.hasToken)}</div>
          </div>
          <div className="rounded bg-white p-3 border">
            <div className="font-medium">Is Authenticated</div>
            <div>{String(authStatus.isAuthed)}</div>
          </div>
          <div className="rounded bg-white p-3 border">
            <div className="font-medium">Expires At</div>
            <div>
              {tokenInfo?.expires_at
                ? `${tokenInfo.expires_at} (${new Date(tokenInfo.expires_at * 1000).toLocaleString()})`
                : "-"}
            </div>
          </div>
        </div>
        <details className="mt-3">
          <summary className="cursor-pointer">Raw Token JSON</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black p-3 text-green-200 text-xs">
{JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </details>
        {!authStatus.hasToken && (
          <div className="mt-3 rounded border border-red-300 bg-red-50 p-3 text-red-800">
            NO TOKEN FOUND - Please login again
          </div>
        )}
      </Section>

      <Section
        title="Athlete Profile"
        bg="bg-green-50"
        right={<CopyButton data={profile || {}} />}
      >
        {loadingProfile && (
          <div className="text-sm text-gray-600">Loading profile...</div>
        )}
        {profileError && (
          <div className="mb-2 rounded border border-red-300 bg-red-50 p-2 text-red-800 text-sm">{profileError}</div>
        )}
        {!profile && !loadingProfile ? (
          <div className="text-sm text-gray-600">No profile loaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              {profile.profile && (
                <img
                  src={profile.profile}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border"
                />
              )}
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {profile.firstname} {profile.lastname}</div>
              <div><span className="font-medium">Location:</span> {profile.city}, {profile.state}, {profile.country}</div>
              <div><span className="font-medium">Sex:</span> {profile.sex}</div>
              <div><span className="font-medium">Weight:</span> {profile.weight ?? "-"}</div>
              <div><span className="font-medium">Created:</span> {fmtDate(profile.created_at)}</div>
              <div><span className="font-medium">Updated:</span> {fmtDate(profile.updated_at)}</div>
              <div><span className="font-medium">Premium:</span> {String(profile.premium)}</div>
              <div><span className="font-medium">Summit:</span> {String(profile.summit ?? profile.premium)}</div>
              <div className="col-span-2"><span className="font-medium">Email (if present):</span> {profile.email ?? "-"}</div>
            </div>
          </div>
        )}
        <details className="mt-3">
          <summary className="cursor-pointer">Raw Profile JSON</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black p-3 text-green-200 text-xs">
{JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      </Section>

      <Section title="Athlete Stats" bg="bg-yellow-50" right={<CopyButton data={stats || {}} />}>
        {loadingStats && (
          <div className="text-sm text-gray-600">Loading stats...</div>
        )}
        {statsError && (
          <div className="mb-2 rounded border border-red-300 bg-red-50 p-2 text-red-800 text-sm">{statsError}</div>
        )}
        {!stats && !loadingStats ? (
          <div className="text-sm text-gray-600">No stats loaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { key: "recent_run_totals", label: "Recent Runs" },
              { key: "ytd_run_totals", label: "YTD Runs" },
              { key: "all_run_totals", label: "All-time Runs" },
              { key: "recent_ride_totals", label: "Recent Rides" },
              { key: "ytd_ride_totals", label: "YTD Rides" },
              { key: "all_ride_totals", label: "All-time Rides" },
              { key: "recent_swim_totals", label: "Recent Swim" },
              { key: "ytd_swim_totals", label: "YTD Swim" },
              { key: "all_swim_totals", label: "All-time Swim" },
            ].map(({ key, label }) => (
              <div key={key} className="rounded bg-white p-3 border">
                <div className="font-medium mb-1">{label}</div>
                {stats[key] ? (
                  <ul className="space-y-1">
                    <li>Distance: {fmtKm(stats[key].distance)} km</li>
                    <li>Elevation: {stats[key].elevation_gain ?? 0} m</li>
                    <li>Moving Time: {fmtHours(stats[key].moving_time)} h</li>
                    <li>Count: {stats[key].count ?? 0}</li>
                  </ul>
                ) : (
                  <div className="text-gray-500">N/A</div>
                )}
              </div>
            ))}
          </div>
        )}
        <details className="mt-3">
          <summary className="cursor-pointer">Raw Stats JSON</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black p-3 text-green-200 text-xs">
{JSON.stringify(stats, null, 2)}
          </pre>
        </details>
      </Section>

      <Section
        title={`Recent Activities (${activities?.length || 0})`}
        bg="bg-purple-50"
        right={<CopyButton data={activities || []} />}
      >
        {loadingActivities && (
          <div className="text-sm text-gray-600">Loading activities...</div>
        )}
        {activitiesError && (
          <div className="mb-2 rounded border border-red-300 bg-red-50 p-2 text-red-800 text-sm">{activitiesError}</div>
        )}
        {activities?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((a) => (
              <div key={a.id} className="rounded bg-white p-4 border text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.type}</div>
                </div>
                <div className="text-xs text-gray-600 mb-2">{fmtDate(a.start_date)}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Distance: {fmtKm(a.distance)} km</div>
                  <div>Moving: {fmtHMS(a.moving_time)}</div>
                  <div>Avg Speed: {(a.average_speed ?? 0).toFixed(2)} m/s</div>
                  <div>Max Speed: {(a.max_speed ?? 0).toFixed(2)} m/s</div>
                  <div>Elevation: {a.total_elevation_gain ?? 0} m</div>
                  <div>Avg HR: {a.average_heartrate ?? "-"}</div>
                  <div>Max HR: {a.max_heartrate ?? "-"}</div>
                  <div>Kudos: {a.kudos_count ?? 0}</div>
                  <div>Comments: {a.comment_count ?? 0}</div>
                  <div>
                    Start: {a.start_latlng ? `${a.start_latlng[0]}, ${a.start_latlng[1]}` : "-"}
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs">Raw JSON</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black p-3 text-green-200 text-[10px]">
{JSON.stringify(a, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No activities loaded yet.</div>
        )}

        <details className="mt-3">
          <summary className="cursor-pointer">Raw JSON (first activity detail)</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black p-3 text-green-200 text-xs">
{JSON.stringify(activities?.[0] || null, null, 2)}
          </pre>
        </details>
      </Section>

      <Section title="Data Processor Results" bg="bg-red-50" right={<CopyButton data={processorResults} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded bg-white p-3 border">
            <div className="font-medium mb-1">Totals</div>
            <ul className="space-y-1">
              <li>Total Distance: {processorResults.totalKm} km</li>
              <li>Total Time: {processorResults.totalHours} h</li>
              <li>Average Pace: {processorResults.avgPace ?? "-"} min/km</li>
            </ul>
          </div>
          <div className="rounded bg-white p-3 border">
            <div className="font-medium mb-1">Personal Records</div>
            <ul className="space-y-1">
              <li>Longest Run: {processorResults.prs?.longestRun?.name ?? "-"}</li>
              <li>Fastest Pace Run: {processorResults.prs?.fastestPaceRun?.name ?? "-"}</li>
              <li>Most Elevation: {processorResults.prs?.mostElevation?.name ?? "-"}</li>
            </ul>
          </div>
          <div className="rounded bg-white p-3 border">
            <div className="font-medium mb-1">By Type</div>
            <pre className="whitespace-pre-wrap break-all text-xs">
{JSON.stringify(processorResults.byType, null, 2)}
            </pre>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-medium mb-1">Monthly</div>
          <pre className="whitespace-pre-wrap break-all rounded bg-white p-3 border text-xs">
{JSON.stringify(processorResults.monthly, null, 2)}
          </pre>
        </div>
      </Section>

      <Section title="Manual Tests" bg="bg-slate-50">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={async () => {
              try {
                console.group("🧪 Test Profile Fetch");
                console.log("Calling getAthleteProfile()...");
                const res = await getAthleteProfile();
                console.log("Result:", res);
                console.groupEnd();
              } catch (e) {
                console.error("Test Profile Fetch error", e);
              }
            }}
          >
            Test Profile Fetch
          </button>
          <button
            className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
            onClick={async () => {
              try {
                console.group("🧪 Test Stats Fetch");
                const prof = profile || (await getAthleteProfile());
                console.log("Using athlete id:", prof?.id);
                const res = prof?.id ? await getAthleteStats(prof.id) : null;
                console.log("Result:", res);
                console.groupEnd();
              } catch (e) {
                console.error("Test Stats Fetch error", e);
              }
            }}
          >
            Test Stats Fetch
          </button>
          <button
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            onClick={async () => {
              try {
                console.group("🧪 Test Activities Fetch");
                const res = await getActivities(1, 30);
                console.log("Result:", res);
                console.groupEnd();
              } catch (e) {
                console.error("Test Activities Fetch error", e);
              }
            }}
          >
            Test Activities Fetch
          </button>
        </div>
      </Section>
    </div>
  );
};

export default DataTest;


