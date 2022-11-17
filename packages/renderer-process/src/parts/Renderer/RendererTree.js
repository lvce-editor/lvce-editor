import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const renderTemplate = () => {
  const label = document.createElement('div')
  label.className = 'TreeItemLabel'
  const root = document.createElement('div')
  root.className = 'ListItem TreeItem'
  // @ts-ignore
  root.role = AriaRoles.TreeItem
  root.append(label)
  return {
    root,
    label,
  }
}

export const renderElement = (template, data, index) => {
  template.label.textContent = data.name
  template.root.setAttribute('aria-level', data.level)
  // TODO renderer should do the index and id thing
  // template.root.id = `treeitem-${index}`
  template.root.dataset.index = index
  template.root.title = data.absolutePath
  switch (data.type) {
    case /* file */ 'file':
      template.root.removeAttribute('aria-expanded')
      break
    case /* expandedFolder */ 'directory-expanded':
      template.root.setAttribute('aria-expanded', 'true')
      break
    case /* collapsedFolder */ 'directory':
      template.root.setAttribute('aria-expanded', 'false')
      break
    default:
      break
  }
}

export const renderWrapper = (wrapper) => {
  wrapper.role = AriaRoles.Tree
  wrapper.ariaLabel = 'Files Explorer'
  wrapper.setAttribute('aria-multiselectable', 'true')
}
