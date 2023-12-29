import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deleted = {
  type: VirtualDomElements.Del,
  className: ClassNames.HighlightDeleted,
  childCount: 1,
}

const inserted = {
  type: VirtualDomElements.Ins,
  className: ClassNames.HighlightInserted,
  childCount: 1,
}

const highlighted = {
  type: VirtualDomElements.Span,
  className: ClassNames.Highlight,
  childCount: 1,
}

const renderRow = (rowInfo) => {
  const { top, type, matchStart, matchLength, text: displayText, title, icon, setSize, posInSet, depth, replacement } = rowInfo
  const treeItem = {
    type: VirtualDomElements.Div,
    role: AriaRoles.TreeItem,
    className: ClassNames.TreeItem,
    title,
    ariaSetSize: setSize,
    ariaLevel: depth,
    ariaPosInSet: posInSet,
    ariaLabel: title,
    ariaDescription: '',
    childCount: 1,
    paddingLeft: `${depth * 1 + 1}rem`,
  }
  switch (type) {
    case DirentType.Directory:
      treeItem.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanded:
      treeItem.ariaExpanded = 'true'
      break
    case DirentType.File:
      break
    default:
      break
  }
  const dom = []

  dom.push(treeItem)
  if (icon) {
    treeItem.childCount++
    dom.push(GetFileIconVirtualDom.getFileIconVirtualDom(icon))
  }
  const label = {
    type: VirtualDomElements.Div,
    className: ClassNames.Label,
    childCount: 1,
  }
  dom.push(label)
  if (matchLength) {
    const before = displayText.slice(0, matchStart)
    const highlight = displayText.slice(matchStart, matchStart + matchLength)
    const after = displayText.slice(matchStart + matchLength)
    if (replacement) {
      dom.push(text(before), deleted, text(highlight), inserted, text(replacement), text(after))
      label.childCount = 4
    } else {
      label.childCount = 3
      dom.push(text(before), highlighted, text(highlight), text(after))
    }
  } else {
    dom.push(text(displayText))
  }
  return dom
}

export const getSearchResultsVirtualDom = (visibleItems, replaceExpanded) => {
  /**
   * @type {any[]}
   */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeader',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeaderTop',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      className: `IconButton SearchToggleButton ${replaceExpanded ? 'SearchToggleButtonExpanded' : ''}`,
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: replaceExpanded,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon ${replaceExpanded ? 'MaskIconChevronDown' : 'MaskIconChevronRight'}`,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeaderTopRight',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchField',
      childCount: 4,
    },
    {
      type: VirtualDomElements.TextArea,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Search',
      name: 'search-value',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchFieldButton',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchFieldButton',
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchFieldButton',
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchField SearchFieldReplace',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Input,
      className: 'SearchFieldInput',
      spellcheck: false,
      autocapitalize: 'off',
      inputType: 'text',
      autocorrect: 'off',
      placeholder: 'Replace',
      name: 'search-replace-value',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: 'SearchFieldButton',
      title: 'Replace All',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconReplaceAll',
      role: 'none',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    text('3 results in 2 files'),
  ]
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet List',
    role: 'tree',
    tabIndex: 0,
    childCount: visibleItems.length,
  })
  dom.push(...visibleItems.flatMap(renderRow))
  return dom
}
