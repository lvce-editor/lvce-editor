export const create = ({ options }) => {
  const $Select = document.createElement('select')
  for (const option of options) {
    const $Option = document.createElement('option')
    $Option.textContent = option
    $Select.append($Option)
  }
  return $Select
}
