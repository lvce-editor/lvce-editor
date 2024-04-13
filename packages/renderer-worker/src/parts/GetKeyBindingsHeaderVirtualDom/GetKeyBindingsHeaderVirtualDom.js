import * as KeyBindingStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'

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
      onInput: DomEventListenerFunctions.HandleInput,
      ariaDescription: KeyBindingStrings.resultsWillUpdateAsYouType(),
      childCount: 0,
    },
  ]
}
