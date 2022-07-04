export const create = (url) => {
  return new Worker(url, {
    type: 'module',
  })
}
