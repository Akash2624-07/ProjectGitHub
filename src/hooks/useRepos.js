import { useState, useCallback, useRef } from "react";

const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

export function useRepos() {
    const [repos, setRepos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    const usernameRef = useRef(null);
    const observer = useRef();

    const load = useCallback(async (username, pageNumber = 1) => {
        try {
            setLoading(true);
            setVisible(true);
            usernameRef.current = username;

            const response = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=10&page=${pageNumber}`,
                { headers }
            );

            if (!response.ok) throw new Error("Failed to fetch repos");

            const data = await response.json();

            setHasMore(data.length === 10);
            setRepos(prev => (pageNumber === 1 ? data : [...prev, ...data]));
            setPage(pageNumber);
        } catch (err) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Attached to the last repo card; fires the next page once it scrolls into view.
    const lastRepoRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && usernameRef.current) {
                load(usernameRef.current, page + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, page, load]);

    const reset = useCallback(() => {
        setRepos([]);
        setVisible(false);
        setHasMore(false);
        setPage(1);
    }, []);

    return { repos, visible, loading, hasMore, load, lastRepoRef, reset };
}
