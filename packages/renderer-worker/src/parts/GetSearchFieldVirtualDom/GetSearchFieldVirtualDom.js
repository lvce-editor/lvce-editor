import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetSearchFieldButtonVirtualDom from '../GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldVirtualDom = (name, placeholder, onInput, insideButtons, outsideButtons, onFocus = '') => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SearchField,
      role: AriaRoles.None,
      childCount: 2,
    },
    {
      type: VirtualDomElements.TextArea,
      className: ClassNames.MultilineInputBox,
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
      className: ClassNames.SearchFieldButtons,
      childCount: insideButtons.length,
    },
    ...insideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom),
  ]
  if (outsideButtons.length > 0) {
    dom.unshift({
      type: VirtualDomElements.Div,
      className: ClassNames.SearchFieldContainer,
      role: AriaRoles.None,
      childCount: 1 + outsideButtons.length,
    })
    dom.push(...outsideButtons.flatMap(GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom))
  }
  return dom
}
