export const getElectronMenuItems = (menuItems, click) => {
  const template = []
  for (const menuItem of menuItems) {
    template.push({
      ...menuItem,
      click,
    })
  }
  return template
}
