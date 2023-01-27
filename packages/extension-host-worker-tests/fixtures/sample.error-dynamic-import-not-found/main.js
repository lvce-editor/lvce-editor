const add = await import('./add.js')

export const activate = () => {
  add(1, 2)
}
