import * as Browser from '../Browser/Browser.js'

export const getScrollSpeed = (preferences: Readonly<Record<string, unknown>>, browser = Browser.getBrowser()): number => {
  if (browser === 'firefox') {
    const firefoxValue = preferences['application.scrollspeed.firefox']
    return typeof firefoxValue === 'number' && Number.isFinite(firefoxValue) && firefoxValue >= 1 && firefoxValue <= 10 ? firefoxValue : 5
  }
  const value = preferences['application.scrollspeed']
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 10 ? value : 1
}
