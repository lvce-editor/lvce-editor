import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'

export const getSearchHeaderVirtualDom = (replaceExpanded, matchCase, matchWholeWord, useRegularExpression) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeader',
      childCount: 2,
      onClick: 'handleHeaderClick',
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
      'data-command': 'toggleReplace',
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon ${replaceExpanded ? 'MaskIconChevronDown' : 'MaskIconChevronRight'}`,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeaderTopRight',
      childCount: replaceExpanded ? 2 : 1,
    },
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('search-value', 'Search', 'handleInput', [
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
    ]),
  ]
  if (replaceExpanded) {
    dom.push(
      ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('search-replace-value', 'Replace', 'handleReplaceInput', [
        {
          icon: 'MaskIconReplaceAll',
          checked: false,
          title: 'Replace All',
        },
      ]),
    )
  }
  return dom
}
