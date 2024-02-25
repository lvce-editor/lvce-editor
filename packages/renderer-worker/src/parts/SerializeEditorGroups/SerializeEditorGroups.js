import * as SerializeEditors from '../SerializeEditors/SerializeEditors.js'

const serializeEditorGroup = (group) => {
  const { editors, activeIndex, tabsDeltaX, x, y, width, height } = group
  return {
    editors: SerializeEditors.serializeEditors(editors),
    activeIndex,
    tabsDeltaX,
    x,
    y,
    width,
    height,
  }
}

export const serializeEditorGroups = (groups) => {
  return groups.map(serializeEditorGroup)
}
