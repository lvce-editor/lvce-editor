export const create = (action) => {
  const { id } = action
  const $Button = document.createElement('div')
  $Button.textContent = id
  return $Button
}
