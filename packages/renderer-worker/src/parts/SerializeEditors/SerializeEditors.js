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

export const serializeEditors = (editors) => {
  return editors.map(serializeEditor)
}
