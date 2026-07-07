function RepoCard({ repo, innerRef }) {
    return (
        <div ref={innerRef} className="repo-card">
            <h3 className="repo-name">{repo.name}</h3>

            {repo.description && <p className="repo-description">{repo.description}</p>}

            <div className="repo-meta">
                <span className="repo-lang">{repo.language || "Unknown"}</span>
                <span className="repo-stars">⭐ {repo.stargazers_count}</span>
                <span className="repo-forks">🍴 {repo.forks_count}</span>
            </div>

            <a className="repo-link" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                Open Repository
            </a>
        </div>
    );
}

export default RepoCard;
