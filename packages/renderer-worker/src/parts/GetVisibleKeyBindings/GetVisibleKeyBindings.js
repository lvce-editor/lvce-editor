import * as GetWhenExpressionText from '../GetWhenExpressionText/GetWhenExpressionText.js'

export const getVisibleKeyBindings = (filteredKeyBindings, minLineY, maxLineY, selectedIndex) => {
  const visibleKeyBindings = []
  const slicedKeyBindings = filteredKeyBindings.slice(minLineY, maxLineY)
  for (let i = 0; i < slicedKeyBindings.length; i++) {
    const slicedKeyBinding = slicedKeyBindings[i]
    const { isCtrl, isShift, key, when, command, commandMatches, keyMatches } = slicedKeyBinding
    visibleKeyBindings.push({
      rowIndex: minLineY + i + 2,
      isCtrl,
      isShift,
      key,
      when: GetWhenExpressionText.getWhenExpressionText(when),
      command,
      selected: i === selectedIndex,
      commandMatches,
      keyMatches,
    })
  }
  return visibleKeyBindings
}
