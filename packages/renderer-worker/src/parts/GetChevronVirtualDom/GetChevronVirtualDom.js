import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getChevronDownVirtualDom = (extraClassName = '') => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronDown ${extraClassName}`,
    childCount: 0,
  }
}

export const getChevronRightVirtualDom = (extraClassName = '') => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronRight ${extraClassName}`,
    childCount: 0,
  }
}
