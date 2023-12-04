import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.js'

export const setProps = ($Element, props) => {
  for (const key in props) {
    VirtualDomElementProp.setProp($Element, key, props[key])
  }
}
