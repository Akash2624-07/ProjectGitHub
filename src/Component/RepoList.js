import RepoCard from "./RepoCard";

function RepoList({ repos, loading, lastRepoRef }) {
    return (
        <div className="repolist">
            {repos.map((repo, index) => (
                <RepoCard
                    key={repo.id}
                    repo={repo}
                    innerRef={index === repos.length - 1 ? lastRepoRef : undefined}
                />
            ))}

            {loading && <p>Loading more repos...</p>}
        </div>
    );
}

export default RepoList;
