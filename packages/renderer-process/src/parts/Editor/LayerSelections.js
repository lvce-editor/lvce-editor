import * as Assert from '../Assert/Assert.js'
import * as Logger from '../Logger/Logger.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

const create$Selection = () => {
  const $Selection = document.createElement('div')
  $Selection.className = 'EditorSelection'
  return $Selection
}

const render$Selection = ($Selection, selections, i) => {
  Assert.object($Selection)
  Assert.number(i)

  const x = selections[i * 4]
  const y = selections[i * 4 + 1]
  const width = selections[i * 4 + 2]
  const height = selections[i * 4 + 3]
  // TODO have many decorations per row
  // no absolute positioning
  SetBounds.setBounds($Selection, x, y, width, height)
}

const render$SelectionsLess = ($Selections, childCount, selections, selectionCount) => {
  for (let i = 0, j = 0; i < childCount; i++, j += 4) {
    render$Selection($Selections.children[i], selections, i)
  }
  const fragment = document.createDocumentFragment()
  for (let i = childCount; i < selectionCount; i++) {
    const $Selection = create$Selection()
    render$Selection($Selection, selections, i)
    fragment.append($Selection)
  }
  $Selections.append(fragment)
}

const render$SelectionsEqual = ($Selections, childCount, selections, selectionCount) => {
  for (let i = 0; i < selectionCount; i++) {
    render$Selection($Selections.children[i], selections, i)
  }
}

const render$SelectionsMore = ($Selections, childCount, selections, selectionCount) => {
  for (let i = 0; i < selectionCount; i++) {
    render$Selection($Selections.children[i], selections, i)
  }
  const diff = childCount - selectionCount
  for (let i = 0; i < diff; i++) {
    $Selections.lastChild.remove()
  }
}

const render$Selections = ($Selections, selections) => {
  const selectionsCount = selections.length / 4
  const childCount = $Selections.children.length
  if (childCount < selectionsCount) {
    render$SelectionsLess($Selections, childCount, selections, selectionsCount)
  } else if (childCount === selectionsCount) {
    render$SelectionsEqual($Selections, childCount, selections, selectionsCount)
  } else {
    render$SelectionsMore($Selections, childCount, selections, selectionsCount)
  }
}

const renderSelectionsNative = (state, selections) => {
  if (selections.length > 1) {
    Logger.warn('[editor] cannot render more than one native selection')
  }
}

export const setSelections = (state, selections) => {
  render$Selections(state.$LayerSelections, selections)
}
