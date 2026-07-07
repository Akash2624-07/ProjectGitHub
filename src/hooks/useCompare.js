import { useState, useCallback } from "react";

// Holds up to two full profiles selected for side-by-side comparison.
// Selecting a third swaps out the oldest one instead of growing the list.
export function useCompare() {
    const [selected, setSelected] = useState([]);

    const isSelected = useCallback(
        (id) => selected.some(profile => profile.id === id),
        [selected]
    );

    const toggle = useCallback((profile) => {
        setSelected(prev => {
            if (prev.some(p => p.id === profile.id)) {
                return prev.filter(p => p.id !== profile.id);
            }
            if (prev.length >= 2) {
                return [prev[1], profile];
            }
            return [...prev, profile];
        });
    }, []);

    const clear = useCallback(() => setSelected([]), []);

    return { selected, isSelected, toggle, clear };
}
