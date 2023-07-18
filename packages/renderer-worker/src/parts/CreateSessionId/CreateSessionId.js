export const creareSessionId = () => {
  return `session-${new Date().toISOString()}`
}
