import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'

export const renderTemplate = () => {
  const label = document.createElement('div')
  label.className = 'TreeItemLabel'
  const root = document.createElement('div')
  root.className = 'ListItem TreeItem'
  root.role = AriaRoles.TreeItem
  root.append(label)
  return {
    root,
    label,
  }
}

export const renderElement = (template, data, index) => {
  template.label.textContent = data.name
  template.root.setAttribute(DomAttributeType.AriaLevel, data.level)
  // TODO renderer should do the index and id thing
  // template.root.id = `treeitem-${index}`
  template.root.dataset.index = index
  template.root.title = data.absolutePath
  switch (data.type) {
    case /* file */ 'file':
      template.root.removeAttribute(DomAttributeType.AriaExpanded)
      break
    case /* expandedFolder */ 'directory-expanded':
      template.root.setAttribute(DomAttributeType.AriaExpanded, AriaBoolean.True)
      break
    case /* collapsedFolder */ 'directory':
      template.root.setAttribute(DomAttributeType.AriaExpanded, AriaBoolean.False)
      break
    default:
      break
  }
}

export const renderWrapper = (wrapper) => {
  wrapper.role = AriaRoles.Tree
  wrapper.ariaLabel = 'Files Explorer'
  wrapper.setAttribute(DomAttributeType.AriaMultiSelectable, AriaBoolean.True)
}
