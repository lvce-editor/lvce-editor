import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldVirtualDom = (name, placeholder, onInput, buttons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchField',
      childCount: 1 + buttons.length,
    },
    {
      type: VirtualDomElements.TextArea,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder,
      name,
      onInput,
      childCount: 0,
    },
    ...buttons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  return dom
}
