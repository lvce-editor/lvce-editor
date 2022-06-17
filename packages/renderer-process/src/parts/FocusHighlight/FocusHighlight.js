export const highlightStart = ($Element) => {
  $Element.classList.remove('Highlight')
  requestAnimationFrame(() => {
    $Element.classList.add('Highlight')
  })

  $Element.onanimationend = () => {
    $Element.classList.remove('Highlight')
  }
}

export const highlightStop = () => {}
