import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as InputName from '../InputName/InputName.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getActionFilterVirtualDom = (action) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Filter,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: action.placeholder,
      onInput: action.command,
      name: InputName.Filter,
      value: action.value,
    },
  )
  if (action.badgeText) {
    // @ts-ignore
    dom[0].childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.FilterBadge,
        childCount: 1,
      },
      text(action.badgeText),
    )
  }
  return dom
}
