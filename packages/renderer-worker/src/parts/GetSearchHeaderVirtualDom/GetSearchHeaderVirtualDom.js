import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSearchHeaderVirtualDom = (replaceExpanded, matchCase, matchWholeWord, useRegularExpression, detailsExpanded) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeader',
      role: 'none',
      childCount: 2,
      onClick: 'handleHeaderClick',
      onFocusIn: 'handleHeaderFocusIn',
    },
    {
      type: VirtualDomElements.Div,
      className: 'SearchHeaderTop',
      role: 'none',
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
      role: 'none',
      childCount: replaceExpanded ? 2 : 1,
    },
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
  ]
  if (replaceExpanded) {
    dom.push(
      ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom(
        'search-replace-value',
        'Replace',
        'handleReplaceInput',
        [
          {
            icon: 'MaskIconPreserveCase',
            checked: false,
            title: 'Preserve Case',
          },
        ],
        [
          {
            icon: 'MaskIconReplaceAll',
            checked: false,
            title: 'Replace All',
          },
        ],
      ),
    )
  }
  if (detailsExpanded) {
    console.log({ detailsExpanded })
    dom[0].childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'SearchHeaderDetails',
        childCount: 4,
      },
      text('files to include'),
      {
        type: VirtualDomElements.Input,
        childCount: 0,
      },
      text('files to exclude'),
      {
        type: VirtualDomElements.Input,
        childCount: 0,
      },
    )
  }
  return dom
}
