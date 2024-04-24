import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetActionButtonVirtualDom from '../GetActionButtonVirtualDom/GetActionButtonVirtualDom.js'
import * as InputName from '../InputName/InputName.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsFilterVirtualDom = (action) => {
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
  // @ts-ignore
  dom[0].childCount++
  dom.push(
    ...GetActionButtonVirtualDom.getActionButtonVirtualDom({
      id: 'more filters',
      icon: MaskIcon.Filter,
      command: 'more filters',
    }),
  )
  return dom
}
