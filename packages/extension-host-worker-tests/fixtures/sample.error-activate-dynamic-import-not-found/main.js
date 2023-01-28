export const activate = async () => {
  const add = await import('./add.js')
  add(1, 2)
}
