import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const h = (type, props, childCount) => {
  return {
    type,
    props,
    childCount,
  }
}

export const text = (data) => {
  return h(
    VirtualDomElements.Text,
    {
      text: data,
    },
    0
  )
}
