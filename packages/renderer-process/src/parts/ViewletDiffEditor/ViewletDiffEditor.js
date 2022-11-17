import * as ViewletSash from '../ViewletSash/ViewletSash.js'
import * as ViewletDiffEditorEvents from './ViewletDiffEditorEvents.js'

export const create = () => {
  const $ContentLeft = document.createElement('div')
  $ContentLeft.className = 'DiffEditorContentLeft'
  const $ContentRight = document.createElement('div')
  $ContentRight.className = 'DiffEditorContentRight'

  const $Sash = ViewletSash.create()

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.onpointerdown = ViewletDiffEditorEvents.handleScrollBarPointerDown
  $ScrollBar.append($ScrollBarThumb)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DiffEditor'
  $Viewlet.append($ContentLeft, $Sash, $ContentRight, $ScrollBar)
  $Viewlet.addEventListener('wheel', ViewletDiffEditorEvents.handleWheel, {
    passive: true,
  })

  return {
    $Viewlet,
    $ContentLeft,
    $ContentRight,
    $ScrollBar,
    $ScrollBarThumb,
  }
}

const create$Line = (line) => {
  const $Line = document.createElement('div')
  $Line.className = 'EditorRow'
  $Line.textContent = line
  return $Line
}

const setContent = ($Content, lines) => {
  $Content.replaceChildren(...lines.map(create$Line))
}

export const setContentLeft = (state, lines) => {
  const { $ContentLeft } = state
  setContent($ContentLeft, lines)
}

export const setContentRight = (state, lines) => {
  const { $ContentRight } = state
  setContent($ContentRight, lines)
}

export const setChanges = (state, changes) => {
  const { $ContentLeft, $ContentRight } = state
  const { changesLeft, changesRight } = changes
  for (const change of changesLeft) {
    if (change.type === 'delete') {
      const $Row = $ContentLeft.children[change.index]
      if ($Row) {
        $Row.classList.add('Deletion')
      }
    }
  }
  for (const change of changesRight) {
    if (change.type === 'insert') {
      const $Row = $ContentRight.children[change.index]
      if ($Row) {
        $Row.classList.add('Insertion')
      }
    }
  }
}

export * from '../ViewletScrollable/ViewletScrollable.js'
