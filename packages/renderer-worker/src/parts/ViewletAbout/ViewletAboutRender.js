import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.js'
import * as AboutStrings from '../AboutStrings/AboutStrings.js'

export const hasFunctionalRender = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const versionKey = AboutStrings.version()
    const versionValue = newState.version
    const commitKey = AboutStrings.commit()
    const commitValue = newState.commit
    const dateKey = AboutStrings.date()
    const dateValue = newState.date
    const browserKey = AboutStrings.browser()
    const browserValue = newState.browser
    const dom = GetAboutVirtualDom.getAboutVirtualDom(
      newState.productName,
      versionKey,
      versionValue,
      commitKey,
      commitValue,
      dateKey,
      dateValue,
      browserKey,
      browserValue,
    )
    return ['setDom', dom]
  },
}

export const render = [renderDialog]
