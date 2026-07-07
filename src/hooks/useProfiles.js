import { useState, useCallback } from "react";

// Only attach an Authorization header when a token actually exists —
// sending "Bearer undefined" causes GitHub to reject every request with a 401.
const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

function clampCount(count) {
    const parsed = Number(count);
    if (!Number.isFinite(parsed)) return 10;
    return Math.min(Math.max(Math.floor(parsed), 1), 100);
}

export function useProfiles() {
    const [profiles, setProfiles] = useState([]);
    const [singleUser, setSingleUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRandom = useCallback(async (count) => {
        try {
            setLoading(true);
            setError(null);
            setSingleUser(false);

            const safeCount = clampCount(count);
            const since = Math.floor(1 + Math.random() * 10000);

            const response = await fetch(
                `https://api.github.com/users?since=${since}&per_page=${safeCount}`,
                { headers }
            );

            if (!response.ok) {
                throw new Error(
                    response.status === 403
                        ? "GitHub API rate limit exceeded. Try again later."
                        : "Failed to fetch users"
                );
            }

            setProfiles(await response.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSingle = useCallback(async (username) => {
        if (!username) return;

        try {
            setLoading(true);
            setError(null);
            setSingleUser(true);

            const response = await fetch(`https://api.github.com/users/${username}`, { headers });

            if (!response.ok) {
                throw new Error(
                    response.status === 404 ? "User not found" : "Failed to fetch user"
                );
            }

            const data = await response.json();
            setProfiles([data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setError(null);
        setSingleUser(false);
    }, []);

    return { profiles, singleUser, loading, error, fetchRandom, fetchSingle, reset };
}
