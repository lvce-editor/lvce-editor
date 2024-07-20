import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const h = (type, props, childCount) => {
  return {
    type,
    ...props,
    childCount,
  }
}

export const text = (data) => {
  return {
    type: VirtualDomElements.Text,
    text: data,
    childCount: 0,
  }
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

export const ins = (props, childCount) => {
  return h(VirtualDomElements.Ins, props, childCount)
}

export const del = (props, childCount) => {
  return h(VirtualDomElements.Del, props, childCount)
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

export const colgroup = (props, childCount) => {
  return h(VirtualDomElements.ColGroup, props, childCount)
}

export const col = (props, childCount) => {
  return h(VirtualDomElements.Col, props, childCount)
}

export const button = (props, childCount) => {
  return h(VirtualDomElements.Button, props, childCount)
}

export const span = (props, childCount) => {
  return h(VirtualDomElements.Span, props, childCount)
}

export const i = (props, childCount) => {
  return h(VirtualDomElements.I, props, childCount)
}

export const img = (props) => {
  return h(VirtualDomElements.Img, props, 0)
}

export const root = (props, childCount) => {
  return h(VirtualDomElements.Root, props, childCount)
}
