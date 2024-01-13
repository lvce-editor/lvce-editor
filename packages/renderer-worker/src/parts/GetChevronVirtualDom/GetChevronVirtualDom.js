import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getChevronDownVirtualDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronDown`,
    childCount: 0,
  }
}

export const getChevronRightVirtualDom = () => {
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.Chevron} MaskIconChevronRight`,
    childCount: 0,
  }
}
