import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getActionFilterVirtualDom = (action) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'Filter',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: action.placeholder,
      onInput: action.command,
      name: 'filter',
      value: action.value,
    },
  )
  if (action.badgeText) {
    // @ts-ignore
    dom[0].childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'FilterBadge',
        childCount: 1,
      },
      text(action.badgeText),
    )
  }
  return dom
}
