import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as InputName from '../InputName/InputName.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const useChevrons = false

const getItemVirtualDomFile = (item) => {
  const { posInSet, setSize, icon, name, path, depth, isFocused, isEditing } = item

  const dom = []

  dom.push(
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.TreeItem,
      className: ClassNames.TreeItem,
      draggable: true,
      title: path,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      ariaLevel: depth,
      childCount: 2,
      paddingLeft: GetTreeItemIndent.getTreeItemIndent(depth),
      ariaLabel: name,
      ariaDescription: '',
    },
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
  )
  if (isEditing) {
    dom.push({
      type: VirtualDomElements.Input,
      className: 'InputBox',
      id: 'ExplorerInput',
      onInput: 'handleEditingInput',
      childCount: 0,
      name: InputName.ExplorerInput,
    })
  } else {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Label,
        childCount: 1,
      },
      text(name),
    )
  }
  if (isFocused) {
    // @ts-ignore
    dom[0].id = 'TreeItemActive'
  }
  return dom
}

const getItemVirtualDomFolder = (item) => {
  const { posInSet, setSize, icon, name, path, depth, type, isFocused } = item
  let ariaExpanded = ''
  let chevron
  switch (type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      ariaExpanded = 'false'
      chevron = GetChevronVirtualDom.getChevronRightVirtualDom()
      break
    case DirentType.DirectoryExpanding:
      ariaExpanded = 'true' // TODO tree should be aria-busy then
      chevron = GetChevronVirtualDom.getChevronRightVirtualDom()
      break
    case DirentType.DirectoryExpanded:
      ariaExpanded = 'true'
      chevron = GetChevronVirtualDom.getChevronDownVirtualDom()
      break
    case DirentType.File:
      break
    default:
      break
  }
  const dom = []

  dom.push({
    type: VirtualDomElements.Div,
    role: AriaRoles.TreeItem,
    className: ClassNames.TreeItem,
    draggable: true,
    title: path,
    ariaPosInSet: posInSet,
    ariaSetSize: setSize,
    ariaLevel: depth,
    childCount: 2,
    paddingLeft: GetTreeItemIndent.getTreeItemIndent(depth),
    ariaLabel: name,
    ariaExpanded,
    ariaDescription: '',
  })

  if (useChevrons) {
    dom[0].childCount++
    dom.push(chevron)
  }
  dom.push(
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Label,
      childCount: 1,
    },
    text(name),
  )
  if (isFocused) {
    // @ts-ignore
    dom[0].id = 'TreeItemActive'
  }
  return dom
}

export const getExplorerItemVirtualDom = (item) => {
  const { type } = item
  switch (type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanding:
    case DirentType.DirectoryExpanded:
      return getItemVirtualDomFolder(item)
    default:
      return getItemVirtualDomFile(item)
  }
}
