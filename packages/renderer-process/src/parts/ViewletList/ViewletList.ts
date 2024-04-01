import * as SetBounds from '../SetBounds/SetBounds.ts'

export const setContentHeight = (state, height) => {
  const { $ListItems } = state
  SetBounds.setHeight($ListItems, height)
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $ListItems } = state
  SetBounds.setTop($ListItems, negativeMargin)
}

export * from '../ViewletScrollable/ViewletScrollable.ts'
export * from '../ViewletSizable/ViewletSizable.ts'
