import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.ts'

export const setValue = (state, value) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('input')
  $InputBox.value = value
}

export const setColumnWidths = (state, columnWidth1, columnWidth2, columnWidth3) => {
  const paddingLeft = 15
  const { $Viewlet } = state
  const $$Resizers = $Viewlet.querySelectorAll('.Resizer')
  const $Resizer1 = $$Resizers[0]
  const $Resizer2 = $$Resizers[1]
  $Resizer1.style.left = `${paddingLeft + columnWidth1}px`
  $Resizer2.style.left = `${paddingLeft + columnWidth1 + columnWidth2}px`
}

export * from '../ViewletScrollable/ViewletScrollable.ts'
export * from '../ViewletSizable/ViewletSizable.ts'

export const Events = ViewletkeyBindingsEvents
