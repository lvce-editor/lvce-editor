import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSearchFieldButtonVirtualDom = (button) => {
  const { icon, checked, title } = button
  return [
    {
      type: VirtualDomElements.Div,
      className: `SearchFieldButton ${checked ? 'SearchFieldButtonChecked' : ''}`,
      title,
      role: 'checkbox', // TODO use aria roles enum
      ariaChecked: checked,
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon ${icon}`,
      childCount: 0,
    },
  ]
}
