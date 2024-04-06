const getIsMobile = () => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return false
  }
  // @ts-expect-error
  const userAgentData = navigator.userAgentData
  if (userAgentData && 'mobile' in userAgentData) {
    return userAgentData.mobile
  }
  if (navigator.userAgent.includes('Android')) {
    return true
  }
  return false
}

export const isMobile = getIsMobile()
