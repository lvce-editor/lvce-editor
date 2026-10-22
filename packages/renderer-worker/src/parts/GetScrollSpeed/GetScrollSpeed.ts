export const getScrollSpeed = (preferences: Readonly<Record<string, unknown>>): number => {
  const value = preferences['application.scrollspeed']
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 3 ? value : 1
}
