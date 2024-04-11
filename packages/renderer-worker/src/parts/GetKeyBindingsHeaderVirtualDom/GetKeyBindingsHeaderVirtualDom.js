import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const UiStrings = {
  SearchKeyBindings: 'Search Key Bindings', // TODO placeholder string should come from renderer worker
  ResultsWillUpdateAsYouType: 'Results will update as you type',
}

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
      placeholder: UiStrings.SearchKeyBindings,
      name: 'keybindings-filter',
      onInput: 'handleInput',
      childCount: 0,
    },
  ]
}
