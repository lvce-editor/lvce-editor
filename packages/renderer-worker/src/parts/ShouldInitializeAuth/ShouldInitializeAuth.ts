export const shouldInitializeAuth = (hasAuthCallback: boolean, isPromptMode: boolean, isWeb: boolean): boolean => {
  return hasAuthCallback || isPromptMode || isWeb
}
