export const hasFunctionalRender = true

const renderHover = {
  isEqual(oldState, newState) {
    return (
      oldState.sanitzedHtml === newState.sanitzedHtml && oldState.documentation === newState.minLineY && oldState.maxLineY === newState.documentation
    )
  },
  apply(oldState, newState) {
    return [/* method */ 'setHover', newState.sanitzedHtml, newState.documentation]
  },
}

export const render = [renderHover]
