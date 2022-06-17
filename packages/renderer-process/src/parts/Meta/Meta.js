export const setThemeColor = (color) => {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    return
  }
  // @ts-ignore
  meta.content = color
}
