import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.ts'

export const setProps = ($Element, props, eventMap) => {
  for (const key in props) {
    VirtualDomElementProp.setProp($Element, key, props[key], eventMap)
  }
}
