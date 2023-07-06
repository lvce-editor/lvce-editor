export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Storage'
  return {
    $Viewlet,
  }
}

export const setStorage = (state, localStorage) => {
  console.log({ localStorage })
  const { $Viewlet } = state
  $Viewlet.textContent = JSON.stringify(localStorage, null, 2) + '\n'
}
