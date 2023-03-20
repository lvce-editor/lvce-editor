import * as Icon from '../Icon/Icon.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Workspace from '../Workspace/Workspace.js'

const getDisplayItemsGroup = (group, isExpanded) => {
  const displayItems = []
  const { id, label, items } = group
  if (!items) {
    throw new Error(`Source control group is missing an items property`)
  }
  const length = items.length
  const type = isExpanded ? 'directory-expanded' : 'directory'
  const icon = isExpanded ? Icon.ChevronDown : Icon.ChevronRight
  if (length > 0) {
    displayItems.push({
      file: '',
      label: label,
      detail: '',
      posInSet: 1,
      setSize: 1,
      icon,
      decorationIcon: '',
      decorationIconTitle: '',
      decorationStrikeThrough: false,
      type,
      badgeCount: length,
      groupId: id,
    })
  }
  if (isExpanded) {
    for (let i = 0; i < length; i++) {
      const item = items[i]
      const baseName = Workspace.pathBaseName(item.file)
      const folderName = item.file.slice(0, -baseName.length - 1)
      displayItems.push({
        file: item.file,
        label: baseName,
        detail: folderName,
        posInSet: i + 1,
        setSize: length,
        icon: IconTheme.getFileIcon({ name: item.file }),
        decorationIcon: item.icon,
        decorationIconTitle: item.iconTitle,
        decorationStrikeThrough: item.strikeThrough,
        type: 'file',
        badgeCount: 0,
        groupId: id,
      })
    }
  }
  return displayItems
}

export const getDisplayItems = (allGroups, isExpanded) => {
  const displayItems = []
  for (const group of allGroups) {
    const groupDisplayItems = getDisplayItemsGroup(group, isExpanded)
    displayItems.push(...groupDisplayItems)
  }
  return displayItems
}
