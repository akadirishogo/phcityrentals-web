import { useState, useEffect } from 'react';

const SAVED_STORAGE_KEY = 'phcityrent_saved';

export function useSavedProperties() {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  const toggleSave = (propertyId: string) => {
    setSaved((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const isSaved = (propertyId: string) => saved.includes(propertyId);

  return { saved, toggleSave, isSaved };
}
