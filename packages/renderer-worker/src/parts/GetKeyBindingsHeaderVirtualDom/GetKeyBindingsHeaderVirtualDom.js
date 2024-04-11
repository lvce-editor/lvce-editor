import * as KeyBindingStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsHeaderVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'KeyBindingsHeader',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      inputType: 'search',
      placeholder: KeyBindingStrings.searchKeyBindings(),
      name: 'keybindings-filter',
      onInput: 'handleInput',
      childCount: 0,
    },
  ]
}
