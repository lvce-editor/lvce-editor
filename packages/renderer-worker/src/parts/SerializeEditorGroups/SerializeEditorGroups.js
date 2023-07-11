const serializeEditor = (editor) => {
  const { preview, tabWidth, uri, uid, label, icon } = editor
  return {
    preview,
    tabWidth,
    uri,
    uid,
    label,
    icon,
  }
}

const serializeEditors = (editors) => {
  return editors.map(serializeEditor)
}

const serializeEditorGroup = (group) => {
  const { editors, activeIndex, tabsDeltaX, x, y, width, height } = group
  return {
    editors: serializeEditors(editors),
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
