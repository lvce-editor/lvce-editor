import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldVirtualDom = (name, placeholder, onInput, insideButtons, outsideButtons, onFocus = '') => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'SearchField',
      role: AriaRoles.None,
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
      onFocus,
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
      role: AriaRoles.None,
      childCount: 1 + outsideButtons.length,
    })
    dom.push(...outsideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom))
  }
  return dom
}
