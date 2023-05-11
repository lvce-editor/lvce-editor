const serializeEditor = (editor) => {
  const { preview, tabWidth, uri, uid, label } = editor
  return {
    preview,
    tabWidth,
    uri,
    uid,
    label,
  }
}

const serializeEditors = (editors) => {
  return editors.map(serializeEditor)
}

const serializeEditorGroup = (group) => {
  const { editors, activeIndex, tabsDeltaX } = group
  return {
    editors: serializeEditors(editors),
    activeIndex,
    tabsDeltaX,
  }
}

export const serializeEditorGroups = (groups) => {
  return groups.map(serializeEditorGroup)
}
