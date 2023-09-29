const getIsChrome = () => {
  if (typeof navigator === 'undefined') {
    return false
  }
  if (
    // @ts-ignore
    navigator.userAgentData &&
    // @ts-ignore
    navigator.userAgentData.brands
  ) {
    // @ts-ignore
    return navigator.userAgentData.brands.includes('Chromium')
  }
  return false
}

export const isChrome = getIsChrome()
