import { useEffect, useState } from "react";
import { useProfiles } from "../hooks/useProfiles";
import { useRepos } from "../hooks/useRepos";
import { useFavorites } from "../hooks/useFavorites";
import { useCompare } from "../hooks/useCompare";
import Controls from "./Controls";
import ProfileCard from "./ProfileCard";
import RepoList from "./RepoList";
import Favorites from "./Favorites";
import CompareView from "./CompareView";

function Body() {
    const [count, setCount] = useState("10");
    const [username, setUsername] = useState("");
    const [showFavoritesView, setShowFavoritesView] = useState(false);

    const { profiles, singleUser, loading, error, fetchRandom, fetchSingle, reset } = useProfiles();
    const repos = useRepos();
    const { favorites, isFavorite, toggleFavorite } = useFavorites();
    const { selected: compareSelection, isSelected: isComparing, toggle: toggleCompare, clear: clearCompare } = useCompare();

    useEffect(() => {
        fetchRandom(10);
    }, [fetchRandom]);

    function handleSearchRandom() {
        repos.reset();
        fetchRandom(count);
    }

    function handleSearchUser() {
        repos.reset();
        fetchSingle(username);
    }

    if (showFavoritesView) {
        return (
            <Favorites
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onBack={() => setShowFavoritesView(false)}
            />
        );
    }

    if (error) {
        return (
            <>
                <h2>Error: {error}</h2>
                <button
                    onClick={() => {
                        reset();
                        repos.reset();
                    }}
                    className="goBack-btn"
                >
                    Go Back
                </button>
            </>
        );
    }

    return (
        <>
            <Controls
                count={count}
                onCountChange={setCount}
                username={username}
                onUsernameChange={setUsername}
                onSearchRandom={handleSearchRandom}
                onSearchUser={handleSearchUser}
                onShowFavorites={() => setShowFavoritesView(true)}
                favoritesCount={favorites.length}
            />

            <CompareView
                profiles={compareSelection}
                onClear={clearCompare}
                onRemove={toggleCompare}
            />

            {loading ? (
                <p className="loading-state">Loading profiles...</p>
            ) : (
                <div className={`Profiles ${repos.visible ? "repoView" : ""}`}>
                    {profiles.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            singleUser={singleUser}
                            showRepos={repos.visible}
                            isFavorite={isFavorite(profile.id)}
                            onToggleFavorite={toggleFavorite}
                            isComparing={isComparing(profile.id)}
                            onToggleCompare={toggleCompare}
                            onShowRepos={(login) => repos.load(login, 1)}
                        />
                    ))}

                    {repos.visible && (
                        <RepoList repos={repos.repos} loading={repos.loading} lastRepoRef={repos.lastRepoRef} />
                    )}
                </div>
            )}
        </>
    );
}

export default Body;
