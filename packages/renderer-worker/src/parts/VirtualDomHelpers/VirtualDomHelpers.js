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

export const div = (props, childCount) => {
  return h(VirtualDomElements.Div, props, childCount)
}

export const tr = (props, childCount) => {
  return h(VirtualDomElements.Tr, props, childCount)
}

export const kbd = (props, childCount) => {
  return h(VirtualDomElements.Kbd, props, childCount)
}

export const td = (props, childCount) => {
  return h(VirtualDomElements.Td, props, childCount)
}

export const input = (props, childCount) => {
  return h(VirtualDomElements.Input, props, childCount)
}

export const thead = (props, childCount) => {
  return h(VirtualDomElements.THead, props, childCount)
}

export const tbody = (props, childCount) => {
  return h(VirtualDomElements.TBody, props, childCount)
}

export const th = (props, childCount) => {
  return h(VirtualDomElements.Th, props, childCount)
}

export const table = (props, childCount) => {
  return h(VirtualDomElements.Table, props, childCount)
}
