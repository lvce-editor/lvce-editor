import * as Platform from '../Platform/Platform.js'

const create$Selection = () => {
  const $Selection = document.createElement('div')
  $Selection.className = 'EditorSelection'
  return $Selection
}

const render$Selection = ($Selection, selection) => {
  // TODO have many decorations per row
  // no absolute positioning
  $Selection.style.top = `${selection.top}px`
  $Selection.style.left = `${selection.left}px`
  $Selection.style.width = `${selection.width}px`
  $Selection.style.height = `${selection.height}px`
}

const render$SelectionsLess = ($Selections, selections) => {
  for (let i = 0; i < $Selections.children.length; i++) {
    render$Selection($Selections.children[i], selections[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Selections.children.length; i < selections.length; i++) {
    const $Selection = create$Selection()
    render$Selection($Selection, selections[i])
    fragment.append($Selection)
  }
  $Selections.append(fragment)
}

const render$SelectionsEqual = ($Selections, selections) => {
  for (let i = 0; i < selections.length; i++) {
    render$Selection($Selections.children[i], selections[i])
  }
}

const render$SelectionsMore = ($Selections, selections) => {
  for (let i = 0; i < selections.length; i++) {
    render$Selection($Selections.children[i], selections[i])
  }
  const diff = $Selections.children.length - selections.length
  for (let i = 0; i < diff; i++) {
    $Selections.lastChild.remove()
  }
}

const render$Selections = ($Selections, selections) => {
  if ($Selections.children.length < selections.length) {
    render$SelectionsLess($Selections, selections)
  } else if ($Selections.children.length === selections.length) {
    render$SelectionsEqual($Selections, selections)
  } else {
    render$SelectionsMore($Selections, selections)
  }
}

const renderSelectionsNative = (state, selections) => {
  if (selections.length > 1) {
    console.warn('[editor] cannot render more than one native selection')

  }
}

export const setSelections = (state, selections) => {
  if (Platform.isMobileOrTablet()) {
    renderSelectionsNative(state, selections)
    return
  }
  render$Selections(state.$LayerSelections, selections)
}
