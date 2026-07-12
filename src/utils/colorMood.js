const WINE_MOODS = {
  fire: '#C0392B', earth: '#8B6914', ocean: '#1A5276', night: '#2C3E50',
  silver: '#808B96', forest: '#1E8449', gold: '#D4AC0D', rose: '#943126',
};

const FIRE_MOODS = {
  fire: '#E8531C', earth: '#8B4513', ocean: '#2E5C6E', night: '#4A3728',
  silver: '#8C8C8C', forest: '#556B2F', gold: '#C9942A', rose: '#A13D2B',
};

export function getAccentColor(vessel, colorMood) {
  const table = vessel === 'fire' ? FIRE_MOODS : WINE_MOODS;
  return table[colorMood] || (vessel === 'fire' ? '#E8531C' : '#6B1A2A');
}
