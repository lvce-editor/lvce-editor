import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'
import * as GetSearchToggleButtonVirtualDom from '../GetSearchToggleButtonVirtualDom/GetSearchToggleButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getIconButtonVirtualDom = (iconButton) => {
  const { label, icon, disabled } = iconButton
  let className = ClassNames.IconButton
  if (disabled) {
    className += ' ' + ClassNames.IconButtonDisabled
  }
  return [
    {
      type: VirtualDomElements.Button,
      className,
      title: label,
      ariaLaBel: label,
      childCount: 1,
      disabled: disabled ? true : undefined,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}

export const getFindWidgetVirtualDom = (matchCountText, replaceExpanded, buttons, matchCase, matchWholeWord, useRegularExpression) => {
  const dom = []
  dom.push(...GetSearchToggleButtonVirtualDom.getSearchToggleButtonVirtualDom(replaceExpanded))
  dom.push(
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom(
      'search-value',
      'Search',
      'handleInput',
      [
        {
          icon: 'MaskIconCaseSensitive',
          checked: matchCase,
          title: 'Match Case',
        },
        {
          icon: 'MaskIconWholeWord',
          checked: matchWholeWord,
          title: 'Match Whole Word',
        },
        {
          icon: 'MaskIconRegex',
          checked: useRegularExpression,
          title: 'Use Regular Expression',
        },
      ],
      [],
    ),
    {
      type: VirtualDomElements.Button,
      className: `IconButton SearchToggleButton ${replaceExpanded ? 'SearchToggleButtonExpanded' : ''}`,
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: replaceExpanded,
      childCount: 1,
      'data-command': 'toggleReplace',
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon ${replaceExpanded ? 'MaskIconChevronDown' : 'MaskIconChevronRight'}`,
      childCount: 0,
    },
  )
  dom.push(
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom(
      'search-value',
      'Search',
      'handleInput',
      [
        {
          icon: 'MaskIconCaseSensitive',
          checked: matchCase,
          title: 'Match Case',
        },
        {
          icon: 'MaskIconWholeWord',
          checked: matchWholeWord,
          title: 'Match Whole Word',
        },
        {
          icon: 'MaskIconRegex',
          checked: useRegularExpression,
          title: 'Use Regular Expression',
        },
      ],
      [],
    ),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.FindWidgetMatchCount,
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(getIconButtonVirtualDom),
  )

  return dom
}
