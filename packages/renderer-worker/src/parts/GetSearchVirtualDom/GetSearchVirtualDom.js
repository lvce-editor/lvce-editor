import * as GetSearchResultsVirtualDom from '../GetSearchResultsVirtualDom/GetSearchResultsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSearchVirtualDom = (visibleItems, replaceExpanded, matchCase, matchWholeWord, useRegularExpression, message) => {
  const headerTopRight = {
    type: VirtualDomElements.Div,
    className: 'SearchHeaderTopRight',
    childCount: 1,
  }
  /**
   * @type {any[]}
   */
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
    headerTopRight,
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
      className: `SearchFieldButton ${matchCase ? 'SearchFieldButtonChecked' : ''}`,
      title: 'Match Case',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: matchCase,
      'data-command': 'toggleMatchCase',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconCaseSensitive',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: `SearchFieldButton ${matchWholeWord ? 'SearchFieldButtonChecked' : ''}`,
      title: 'Match Whole Word',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: matchWholeWord,
      'data-command': 'toggleMatchWholeWord',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconWholeWord',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: `SearchFieldButton ${useRegularExpression ? 'SearchFieldButtonChecked' : ''}`,
      title: 'Use Regular Expression',
      role: 'checkbox',
      childCount: 1,
      ariaChecked: useRegularExpression,
      'data-command': 'toggleUseRegularExpression',
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconRegex',
      childCount: 0,
    },
  ]
  if (replaceExpanded) {
    headerTopRight.childCount++
    dom.push(
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
    )
  }

  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'ViewletSearchMessage',
      role: 'status',
      tabIndex: 0,
      childCount: 1,
    },
    text(message),
  )

  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet List',
    role: 'tree',
    tabIndex: 0,
    childCount: visibleItems.length,
  })
  dom.push(...GetSearchResultsVirtualDom.getSearchResultsVirtualDom(visibleItems))
  return dom
}
