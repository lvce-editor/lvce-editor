export const closeOneMenu = (state) => {
  const { menus } = state
  const parentMenu = menus.at(-2)
  const newParentMenu = {
    ...parentMenu,
    expanded: false,
  }
  const newMenus = [...menus.slice(0, -2), newParentMenu]
  return {
    ...state,
    menus: newMenus,
  }
}
