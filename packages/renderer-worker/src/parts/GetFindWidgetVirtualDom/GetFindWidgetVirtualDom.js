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
  dom.push(...GetSearchToggleButtonVirtualDom.getSearchToggleButtonVirtualDom(replaceExpanded, 'handleClick'))
  dom.push({
    type: VirtualDomElements.Div,
    className: 'FindWidgetRight',
    childCount: replaceExpanded ? 2 : 1,
  })
  dom.push({
    type: VirtualDomElements.Div,
    className: 'FindWidgetFind',
    childCount: 5,
  })
  dom.push(...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('search-value', 'Find', 'handleInput', [], [], 'handleFocus'))
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.FindWidgetMatchCount,
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(getIconButtonVirtualDom),
  )

  if (replaceExpanded) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'FindWidgetReplace',
        childCount: 1,
      },
      text('replace'),
    )
  }
  return dom
}
