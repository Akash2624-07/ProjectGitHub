import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "gh-explorer-favorites";

function readFavorites() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState(readFavorites);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const isFavorite = useCallback(
        (id) => favorites.some(fav => fav.id === id),
        [favorites]
    );

    const toggleFavorite = useCallback((profile) => {
        setFavorites(prev =>
            prev.some(fav => fav.id === profile.id)
                ? prev.filter(fav => fav.id !== profile.id)
                : [...prev, profile]
        );
    }, []);

    return { favorites, isFavorite, toggleFavorite };
}
