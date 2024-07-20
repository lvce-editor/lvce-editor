import * as Assert from '../Assert/Assert.ts'

const editors = Object.create(null)

export const get = (id: number) => {
  Assert.number(id)
  return editors[id]
}

export const set = (id: number, oldEditor: any, newEditor: any) => {
  Assert.number(id)
  Assert.object(oldEditor)
  Assert.object(newEditor)
  editors[id] = {
    oldState: oldEditor,
    newState: newEditor,
  }
}
