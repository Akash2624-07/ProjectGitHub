function ProfileCard({
    profile,
    singleUser,
    showRepos,
    isFavorite,
    onToggleFavorite,
    isComparing,
    onToggleCompare,
    onShowRepos,
}) {
    return (
        <div className={`cards ${isComparing ? "comparing" : ""}`}>
            <button
                className={`favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={() => onToggleFavorite(profile)}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                {isFavorite ? "★" : "☆"}
            </button>

            <img src={profile.avatar_url} alt={profile.login} />
            <h2>{profile.login}</h2>

            {singleUser && (
                <div className="extraInfo">
                    <p>Repos: {profile.public_repos}</p>
                    <p>Followers: {profile.followers}</p>
                    <p>Following: {profile.following}</p>

                    {!showRepos && (
                        <button className="open-repo" onClick={() => onShowRepos(profile.login)}>
                            Show Repos
                        </button>
                    )}
                </div>
            )}

            <div className="card-actions">
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer">
                    Profile
                </a>

                {singleUser && (
                    <button
                        className={`compare-btn ${isComparing ? "active" : ""}`}
                        onClick={() => onToggleCompare(profile)}
                    >
                        {isComparing ? "Remove from Compare" : "Compare"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProfileCard;
