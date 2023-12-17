const defaultIndent = 1

export const getTreeItemIndent = (depth) => {
  return `${depth * defaultIndent}rem`
}
