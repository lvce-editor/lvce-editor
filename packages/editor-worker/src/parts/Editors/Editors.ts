const editors = Object.create(null)

export const get = (id: number) => {
  return editors[id]
}

export const set = (id: number, oldEditor: any, newEditor: any) => {
  editors[id] = {
    oldState: oldEditor,
    newState: newEditor,
  }
}
