const editors = Object.create(null)

export const get = (id: number, editor: any) => {
  return editors[id]
}

export const set = (id: number, editor: any) => {
  editors[id] = editor
}
