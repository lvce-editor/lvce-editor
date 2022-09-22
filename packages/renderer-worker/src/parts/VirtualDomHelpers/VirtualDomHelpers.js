import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const h = (type, props, children) => {
  return {
    type,
    props,
    children,
  }
}

export const text = (data) => {
  return h(
    VirtualDomElements.Text,
    {
      text: data,
    },
    []
  )
}

export const div = (props, children) => {
  return h(VirtualDomElements.Div, props, children)
}

export const tr = (props, children) => {
  return h(VirtualDomElements.Tr, props, children)
}

export const kbd = (props, children) => {
  return h(VirtualDomElements.Kbd, props, children)
}

export const td = (props, children) => {
  return h(VirtualDomElements.Td, props, children)
}

export const input = (props, children) => {
  return h(VirtualDomElements.Input, props, children)
}

export const thead = (props, children) => {
  return h(VirtualDomElements.THead, props, children)
}

export const tbody = (props, children) => {
  return h(VirtualDomElements.TBody, props, children)
}

export const th = (props, children) => {
  return h(VirtualDomElements.Th, props, children)
}

export const table = (props, children) => {
  return h(VirtualDomElements.Table, props, children)
}

export const i = (props, children) => {
  return h(VirtualDomElements.I, props, children)
}
