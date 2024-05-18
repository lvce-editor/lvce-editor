export const getFonts = () => {
  // @ts-ignore
  return globalThis.fonts || document.fonts
}
