import { useEffect, useState, useRef, useCallback } from "react";

function Body() {


// ================== STATE ==================

// Stores list of users
const [profile, setProfile] = useState([]);

// Number of users to fetch
const [count, setCount] = useState(10);

// Input for username search
const [user, setUser] = useState("");

// Loading state (used for both users + repos)
const [loading, setLoading] = useState(false);

// Error handling
const [error, setError] = useState(null);

// Whether we are viewing a single user
const [singleUser, setSingleUser] = useState(false);

// Whether repo section is visible
const [showRepos, setShowRepos] = useState(false);

// Store repos
const [repos, setRepo] = useState([]);

// Whether more repos exist (used for infinite scroll)
const [hasMoreRepos, setHasMoreRepos] = useState(false);

// Current page for repo pagination
const [repoPageNumber, setRepoPageNumber] = useState(1);

// GitHub API headers (for higher rate limit)
const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };



// ================== FETCH RANDOM USERS ==================

async function getProfile() {
    try {
        setLoading(true);

        // Reset states
        setSingleUser(false);
        setShowRepos(false);
        setHasMoreRepos(false);
        setRepo([]);
        setRepoPageNumber(1);

        // Random "since" value to get different users
        const ran = Math.floor(1 + Math.random() * 10000);

        const response = await fetch(
            `https://api.github.com/users?since=${ran}&per_page=${count}`,
            { headers }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setProfile(data);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}



// ================== FETCH SINGLE USER ==================

async function getUser() {
    if (!user) return;

    try {
        setLoading(true);

        // Reset states
        setSingleUser(true);
        setShowRepos(false);
        setHasMoreRepos(false);
        setRepo([]);
        setRepoPageNumber(1);

        const response = await fetch(
            `https://api.github.com/users/${user}`,
            { headers }
        );

        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        // Wrap single user in array (to reuse UI)
        setProfile([data]);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}



// ================== FETCH REPOS (PAGINATED) ==================

async function getRepos(page = 1) {
    try {
        setLoading(true);

        setShowRepos(true);
        setHasMoreRepos(true);

        const response = await fetch(
            `https://api.github.com/users/${user}/repos?per_page=10&page=${page}`,
            { headers }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch repos");
        }

        const repo_data = await response.json();

        // If less than 10 repos → no more data
        if (repo_data.length < 10) {
            setHasMoreRepos(false);
        }

        // If first page → replace
        if (page === 1) {
            setRepo(repo_data);
        } 
        // Else → append (important for infinite scroll)
        else {
            setRepo(prev => [...prev, ...repo_data]);
        }

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}



// ================== INFINITE SCROLL LOGIC ==================

// Stores observer instance
const observer = useRef();

// This function is attached to the LAST repo element
const lastRepoRef = useCallback(node => {

    // Prevent multiple calls while loading
    if (loading) return;

    // Disconnect old observer (important)
    if (observer.current) observer.current.disconnect();

    // Create new observer
    observer.current = new IntersectionObserver(entries => {

        // If last repo is visible AND more repos exist
        if (entries[0].isIntersecting && hasMoreRepos) {

            const nextPage = repoPageNumber + 1;

            setRepoPageNumber(nextPage);

            // Fetch next page automatically
            getRepos(nextPage);
        }
    });

    // Attach observer to last repo element
    if (node) observer.current.observe(node);

}, [loading, hasMoreRepos, repoPageNumber]);



// ================== INITIAL LOAD ==================

useEffect(() => {
    getProfile();
}, []);



// ================== ERROR HANDLING ==================

if (error) {
    return (
        <>
            <h2>Error: {error}</h2>
            <button
                onClick={() => {
                    setError(null);
                    setSingleUser(false);
                    setShowRepos(false);
                }}
                className="goBack-btn"
            >
                Go Back
            </button>
        </>
    );
}



// ================== UI ==================

return (
    <>
        {/* Controls */}
        <div className="controls">

            {/* Fetch random users */}
            <div className="countBox">
                <input
                    type="text"
                    className="countText"
                    placeholder="Enter a number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                />
                <button onClick={getProfile}>Search Profile</button>
            </div>

            {/* Search specific user */}
            <div className="searchBox">
                <input
                    type="text"
                    className="profile"
                    placeholder="Search Github users..."
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <button onClick={getUser}>Search User</button>
            </div>

        </div>



        {/* Profile + Repo Section */}
        <div className={`Profiles ${showRepos ? "repoView" : ""}`}>

            {/* USER CARDS */}
            {
                profile.map((value) => (
                    <div key={value.id} className="cards">
                        <img src={value.avatar_url} alt={value.login} />
                        <h2>{value.login}</h2>

                        {
                            singleUser && (
                                <div className="extraInfo">
                                    <p>Repos: {value.public_repos}</p>
                                    <p>Followers: {value.followers}</p>
                                    <p>Following: {value.following}</p>

                                    {/* Show repos button */}
                                    {
                                        !showRepos && (
                                            <button
                                                className="open-repo"
                                                onClick={() => getRepos(1)}
                                            >
                                                Show Repos
                                            </button>
                                        )
                                    }
                                </div>
                            )
                        }

                        <a href={value.html_url} target="_blank">
                            Profile
                        </a>
                    </div>
                ))
            }



            {/* REPO LIST WITH INFINITE SCROLL */}
            {
                showRepos && (
                    <div className="repolist">
                        {
                            repos.map((value, index) => {

                                // If last repo → attach observer
                                if (index === repos.length - 1) {
                                    return (
                                        <div
                                            ref={lastRepoRef}
                                            key={value.id}
                                            className="repo-card"
                                        >
                                            <h3>{value.name}</h3>

                                            {value.description && (
                                                <p>{value.description}</p>
                                            )}

                                            <div>
                                                <span>{value.language || "Unknown"}</span>
                                                <span> ⭐ {value.stargazers_count}</span>
                                                <span> 🍴 {value.forks_count}</span>
                                            </div>

                                            <a
                                                href={value.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open Repository
                                            </a>
                                        </div>
                                    );
                                }

                                // Normal repo
                                return (
                                    <div key={value.id} className="repo-card">
                                        <h3>{value.name}</h3>

                                        {value.description && (
                                            <p>{value.description}</p>
                                        )}

                                        <div>
                                            <span>{value.language || "Unknown"}</span>
                                            <span> ⭐ {value.stargazers_count}</span>
                                            <span> 🍴 {value.forks_count}</span>
                                        </div>

                                        <a
                                            href={value.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Open Repository
                                        </a>
                                    </div>
                                );
                            })
                        }

                        {/* Loading indicator */}
                        {loading && <p>Loading more repos...</p>}
                    </div>
                )
            }

        </div>
    </>
);


}

export default Body;
