import * as SetBounds from '../SetBounds/SetBounds.js'

export const setPosition = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumbVertical } = state
  SetBounds.setYAndHeight($ScrollBarThumbVertical, scrollBarY, scrollBarHeight)
}

export const setScrollBarHorizontal = (state, scrollBarX, scrollBarWidth, deltaX) => {
  const { $ScrollBarThumbHorizontal, $EditorLayers } = state
  SetBounds.setXAndWidth($ScrollBarThumbHorizontal, scrollBarX, scrollBarWidth)
  console.log({ deltaX })
  SetBounds.setX($EditorLayers, -deltaX)
}

// TODO scrollbar decorations should be own layer maybe
const create$ScrollBarDiagnostic = () => {
  const $ScrollBarDiagnostic = document.createElement('div')
  $ScrollBarDiagnostic.className = 'ScrollBarDiagnostic'
  return $ScrollBarDiagnostic
}

const render$ScrollBarDiagnostic = ($ScrollBarDiagnostic, scrollBarDiagnostic) => {
  SetBounds.setTop($ScrollBarDiagnostic, scrollBarDiagnostic.top)
}

const render$ScrollBarDiagnosticsLess = ($ScrollBarDiagnostics, scrollBarDiagnostics) => {
  for (let i = 0; i < $ScrollBarDiagnostics.children.length; i++) {
    render$ScrollBarDiagnostic($ScrollBarDiagnostics.children[i], scrollBarDiagnostics[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $ScrollBarDiagnostics.children.length; i < scrollBarDiagnostics.length; i++) {
    const $ScrollBarDiagnostic = create$ScrollBarDiagnostic()
    render$ScrollBarDiagnostic($ScrollBarDiagnostic, scrollBarDiagnostics[i])
    fragment.append($ScrollBarDiagnostic)
  }
  $ScrollBarDiagnostics.append(fragment)
}

const render$ScrollBarDiagnosticsEqual = ($ScrollBarDiagnostics, scrollBarDiagnostics) => {
  for (let i = 0; i < scrollBarDiagnostics.length; i++) {
    render$ScrollBarDiagnostic($ScrollBarDiagnostics.children[i], scrollBarDiagnostics[i])
  }
}

const render$ScrollBarDiagnosticsMore = ($ScrollBarDiagnostics, scrollBarDiagnostics) => {
  for (let i = 0; i < scrollBarDiagnostics.length; i++) {
    render$ScrollBarDiagnostic($ScrollBarDiagnostics.children[i], scrollBarDiagnostics[i])
  }
  const diff = $ScrollBarDiagnostics.children.length - scrollBarDiagnostics.length
  for (let i = 0; i < diff; i++) {
    $ScrollBarDiagnostics.lastChild.remove()
  }
}

const render$ScrollBarDiagnostics = ($ScrollBarDiagnostics, scrollBarDiagnostics) => {
  if ($ScrollBarDiagnostics.children.length < scrollBarDiagnostics.length) {
    render$ScrollBarDiagnosticsLess($ScrollBarDiagnostics, scrollBarDiagnostics)
  } else if ($ScrollBarDiagnostics.children.length === scrollBarDiagnostics.length) {
    render$ScrollBarDiagnosticsEqual($ScrollBarDiagnostics, scrollBarDiagnostics)
  } else {
    render$ScrollBarDiagnosticsMore($ScrollBarDiagnostics, scrollBarDiagnostics)
  }
}

export const setDiagnostics = (editor, scrollBarDiagnostics) => {
  render$ScrollBarDiagnostics(editor.$ScrollBarDiagnostics, scrollBarDiagnostics)
}
