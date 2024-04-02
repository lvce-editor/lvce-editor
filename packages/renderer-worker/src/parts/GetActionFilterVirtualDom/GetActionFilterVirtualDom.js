import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getActionFilterVirtualDom = (action) => {
  return [
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      childCount: 0,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Filter',
      onInput: action.command,
    },
  ]
}
