export const isMobileOrTablet = () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return false
  }
  // @ts-ignore
  const userAgentData = navigator.userAgentData
  if (userAgentData && 'mobile' in userAgentData) {
    userAgentData.mobile
  }
  return false
}
