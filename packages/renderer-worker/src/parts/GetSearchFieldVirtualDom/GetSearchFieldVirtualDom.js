import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldVirtualDom = (name, placeholder, onInput, insideButtons, outsideButtons) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchField',
      role: 'none',
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
      childCount: insideButtons.length,
    },
    ...insideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  if (outsideButtons.length > 0) {
    dom.unshift({
      type: VirtualDomElements.Div,
      className: 'SearchFieldContainer',
      role: 'none',
      childCount: 1 + outsideButtons.length,
    })
    dom.push(...outsideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom))
  }
  return dom
}
