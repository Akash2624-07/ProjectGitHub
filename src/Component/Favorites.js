import ProfileCard from "./ProfileCard";

function Favorites({ favorites, onToggleFavorite, onBack }) {
    return (
        <>
            <div className="favorites-header">
                <h2>Your Favorite Profiles</h2>
                <button onClick={onBack}>Back to Explore</button>
            </div>

            {favorites.length === 0 ? (
                <p className="empty-state">No favorites yet — star a profile to save it here.</p>
            ) : (
                <div className="Profiles">
                    {favorites.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            singleUser={false}
                            showRepos={false}
                            isFavorite={true}
                            onToggleFavorite={onToggleFavorite}
                            isComparing={false}
                            onToggleCompare={() => {}}
                            onShowRepos={() => {}}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default Favorites;
