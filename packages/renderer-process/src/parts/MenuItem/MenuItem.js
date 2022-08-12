const getLabel = (item) => {
  if (!item || !item.label) {
    console.warn('menu item has missing label', item)
    return 'n/a'
  }
  return item.label
}

export const create$MenuItem = (item) => {
  const $MenuItem = document.createElement('li')
  switch (item.flags) {
    case /* None */ 0:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case /* Separator */ 1:
      $MenuItem.className = 'MenuItemSeparator'
      // @ts-ignore
      $MenuItem.role = 'separator'
      break
    case /* Checked */ 2:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'true'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case /* UnChecked */ 3:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'false'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case /* SubMenu */ 4:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = 'true'
      $MenuItem.ariaExpanded = 'false'
      break
    case /* Disabled */ 5:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', 'true')
      break
    default:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      console.warn('invalid menu item flags:', item)
      break
  }
  return $MenuItem
}
