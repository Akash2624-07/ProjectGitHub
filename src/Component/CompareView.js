function Stat({ label, left, right }) {
    const leftWins = left > right;
    const rightWins = right > left;

    return (
        <div className="compare-row">
            <span className={`compare-value ${leftWins ? "winning" : ""}`}>{left}</span>
            <span className="compare-label">{label}</span>
            <span className={`compare-value ${rightWins ? "winning" : ""}`}>{right}</span>
        </div>
    );
}

function CompareView({ profiles, onClear, onRemove }) {
    if (profiles.length === 0) return null;

    const [left, right] = profiles;

    return (
        <div className="compare-panel">
            <div className="compare-header">
                <h2>Compare Profiles</h2>
                <button className="clear-compare-btn" onClick={onClear}>Clear</button>
            </div>

            <div className="compare-profiles">
                {[left, right].map((profile, index) =>
                    profile ? (
                        <div key={profile.id} className="compare-profile">
                            <img src={profile.avatar_url} alt={profile.login} />
                            <h3>{profile.login}</h3>
                            <button className="remove-compare-btn" onClick={() => onRemove(profile)}>
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div key={`empty-${index}`} className="compare-profile empty">
                            <p>Search a user and hit "Compare" to add them here</p>
                        </div>
                    )
                )}
            </div>

            {left && right && (
                <div className="compare-stats">
                    <Stat label="Public Repos" left={left.public_repos} right={right.public_repos} />
                    <Stat label="Followers" left={left.followers} right={right.followers} />
                    <Stat label="Following" left={left.following} right={right.following} />
                </div>
            )}
        </div>
    );
}

export default CompareView;
