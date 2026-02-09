export const HABIT_COLOR_THEMES = [
  { id: 'red', color: '#ef4444', label: 'Red' },
  { id: 'orange', color: '#f97316', label: 'Orange' },
  { id: 'amber', color: '#f59e0b', label: 'Amber' },
  { id: 'yellow', color: '#eab308', label: 'Yellow' },
  { id: 'lime', color: '#84cc16', label: 'Lime' },
  { id: 'green', color: '#10b981', label: 'Green' },
  { id: 'emerald', color: '#059669', label: 'Emerald' },
  { id: 'teal', color: '#14b8a6', label: 'Teal' },
  { id: 'cyan', color: '#06b6d4', label: 'Cyan' },
  { id: 'sky', color: '#0ea5e9', label: 'Sky' },
  { id: 'blue', color: '#3b82f6', label: 'Blue' },
  { id: 'indigo', color: '#6366f1', label: 'Indigo' },
  { id: 'violet', color: '#8b5cf6', label: 'Violet' },
  { id: 'purple', color: '#a855f7', label: 'Purple' },
  { id: 'fuchsia', color: '#d946ef', label: 'Fuchsia' },
  { id: 'pink', color: '#ec4899', label: 'Pink' },
  { id: 'rose', color: '#f43f5e', label: 'Rose' },
  { id: 'slate', color: '#64748b', label: 'Slate' },
] as const;


export const getColorThemeById = (id: string) => {
  return HABIT_COLOR_THEMES.find((t) => t.id === id) || HABIT_COLOR_THEMES[0];
};


export const getColorThemeHex = (id: string) => {
  return getColorThemeById(id).color;
};

