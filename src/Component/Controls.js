function Controls({
    count,
    onCountChange,
    username,
    onUsernameChange,
    onSearchRandom,
    onSearchUser,
    onShowFavorites,
    favoritesCount,
}) {

    function handleCountKeyDown(e) {
        if (e.key === "Enter") onSearchRandom();
    }

    function handleUserKeyDown(e) {
        if (e.key === "Enter") onSearchUser();
    }

    return (
        <div className="controls">
            <div className="countBox">
                <input
                    type="number"
                    min="1"
                    max="100"
                    className="countText"
                    placeholder="Enter a number"
                    value={count}
                    onChange={(e) => onCountChange(e.target.value)}
                    onKeyDown={handleCountKeyDown}
                />
                <button onClick={onSearchRandom}>Search Profile</button>
            </div>

            <div className="searchBox">
                <input
                    type="text"
                    className="profile"
                    placeholder="Search Github users..."
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    onKeyDown={handleUserKeyDown}
                />
                <button onClick={onSearchUser}>Search User</button>
            </div>

            <button className="favorites-toggle" onClick={onShowFavorites}>
                ★ Favorites ({favoritesCount})
            </button>
        </div>
    );
}

export default Controls;
