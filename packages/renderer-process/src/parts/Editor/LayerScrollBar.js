export const setPosition = (state, scrollBarY, scrollBarHeight) => {
  state.$ScrollBarThumb.style.top = `${scrollBarY}px`
  state.$ScrollBarThumb.style.height = `${scrollBarHeight}px`
}

// TODO scrollbar decorations should be own layer maybe
const create$ScrollBarDiagnostic = () => {
  const $ScrollBarDiagnostic = document.createElement('div')
  $ScrollBarDiagnostic.className = 'ScrollBarDiagnostic'
  return $ScrollBarDiagnostic
}

const render$ScrollBarDiagnostic = (
  $ScrollBarDiagnostic,
  scrollBarDiagnostic
) => {
  $ScrollBarDiagnostic.style.top = `${scrollBarDiagnostic.top}px`
}

const render$ScrollBarDiagnosticsLess = (
  $ScrollBarDiagnostics,
  scrollBarDiagnostics
) => {
  for (let i = 0; i < $ScrollBarDiagnostics.children.length; i++) {
    render$ScrollBarDiagnostic(
      $ScrollBarDiagnostics.children[i],
      scrollBarDiagnostics[i]
    )
  }
  const fragment = document.createDocumentFragment()
  for (
    let i = $ScrollBarDiagnostics.children.length;
    i < scrollBarDiagnostics.length;
    i++
  ) {
    const $ScrollBarDiagnostic = create$ScrollBarDiagnostic()
    render$ScrollBarDiagnostic($ScrollBarDiagnostic, scrollBarDiagnostics[i])
    fragment.append($ScrollBarDiagnostic)
  }
  $ScrollBarDiagnostics.append(fragment)
}

const render$ScrollBarDiagnosticsEqual = (
  $ScrollBarDiagnostics,
  scrollBarDiagnostics
) => {
  for (let i = 0; i < scrollBarDiagnostics.length; i++) {
    render$ScrollBarDiagnostic(
      $ScrollBarDiagnostics.children[i],
      scrollBarDiagnostics[i]
    )
  }
}

const render$ScrollBarDiagnosticsMore = (
  $ScrollBarDiagnostics,
  scrollBarDiagnostics
) => {
  for (let i = 0; i < scrollBarDiagnostics.length; i++) {
    render$ScrollBarDiagnostic(
      $ScrollBarDiagnostics.children[i],
      scrollBarDiagnostics[i]
    )
  }
  const diff =
    $ScrollBarDiagnostics.children.length - scrollBarDiagnostics.length
  for (let i = 0; i < diff; i++) {
    $ScrollBarDiagnostics.lastChild.remove()
  }
}

const render$ScrollBarDiagnostics = (
  $ScrollBarDiagnostics,
  scrollBarDiagnostics
) => {
  if ($ScrollBarDiagnostics.children.length < scrollBarDiagnostics.length) {
    render$ScrollBarDiagnosticsLess($ScrollBarDiagnostics, scrollBarDiagnostics)
  } else if (
    $ScrollBarDiagnostics.children.length === scrollBarDiagnostics.length
  ) {
    render$ScrollBarDiagnosticsEqual(
      $ScrollBarDiagnostics,
      scrollBarDiagnostics
    )
  } else {
    render$ScrollBarDiagnosticsMore($ScrollBarDiagnostics, scrollBarDiagnostics)
  }
}

export const setDiagnostics = (editor, scrollBarDiagnostics) => {
  render$ScrollBarDiagnostics(
    editor.$ScrollBarDiagnostics,
    scrollBarDiagnostics
  )
}
