import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionHeaderVirtualDom = (placeholder) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionHeader',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      spellcheck: false,
      autocapitalize: 'off',
      inputType: 'text',
      autocorrect: 'off',
      childCount: 0,
      placeholder,
    },
  ]
}
