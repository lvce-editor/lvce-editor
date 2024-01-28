import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldVirtualDom = (name, placeholder, onInput, buttons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchField',
      childCount: 2,
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
    {
      type: VirtualDomElements.Div,
      className: 'SearchFieldButtons',
      childCount: buttons.length,
    },
    ...buttons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  return dom
}
