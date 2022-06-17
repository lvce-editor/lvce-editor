const create$Diagnostic = () => {
  const $Diagnostic = document.createElement('div')
  $Diagnostic.className = 'EditorDiagnostic'
  return $Diagnostic
}

const render$Diagnostic = ($Diagnostic, diagnostic) => {
  $Diagnostic.style.top = `${diagnostic.top}px`
  $Diagnostic.style.left = `${diagnostic.left}px`
  $Diagnostic.style.width = `${diagnostic.width}px`
  $Diagnostic.style.height = `${diagnostic.height}px`
}

const render$DiagnosticsLess = ($Diagnostics, diagnostics) => {
  for (let i = 0; i < $Diagnostics.children.length; i++) {
    render$Diagnostic($Diagnostics.children[i], diagnostics[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Diagnostics.children.length; i < diagnostics.length; i++) {
    const $Diagnostic = create$Diagnostic()
    render$Diagnostic($Diagnostic, diagnostics[i])
    fragment.append($Diagnostic)
  }
  $Diagnostics.append(fragment)
}

const render$DiagnosticsEqual = ($Diagnostics, diagnostics) => {
  for (let i = 0; i < diagnostics.length; i++) {
    render$Diagnostic($Diagnostics.children[i], diagnostics[i])
  }
}

const render$DiagnosticsMore = ($Diagnostics, diagnostics) => {
  for (let i = 0; i < diagnostics.length; i++) {
    render$Diagnostic($Diagnostics.children[i], diagnostics[i])
  }
  const diff = $Diagnostics.children.length - diagnostics.length
  for (let i = 0; i < diff; i++) {
    $Diagnostics.lastChild.remove()
  }
}

const render$Diagnostics = ($Diagnostics, diagnostics) => {
  if ($Diagnostics.children.length < diagnostics.length) {
    render$DiagnosticsLess($Diagnostics, diagnostics)
  } else if ($Diagnostics.children.length === diagnostics.length) {
    render$DiagnosticsEqual($Diagnostics, diagnostics)
  } else {
    render$DiagnosticsMore($Diagnostics, diagnostics)
  }
}

export const setDiagnostics = (state, diagnostics) => {
  render$Diagnostics(state.$LayerDiagnostics, diagnostics)
}
