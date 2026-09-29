export const shouldInitializeAuth = (hasAuthCallback: boolean, isPromptMode: boolean): boolean => {
  return hasAuthCallback || isPromptMode
}
