export const getTotalTabWidth = (tabs) => {
  let total = 0
  for (const tab of tabs) {
    total += tab.tabWidth
  }
  return total
}
