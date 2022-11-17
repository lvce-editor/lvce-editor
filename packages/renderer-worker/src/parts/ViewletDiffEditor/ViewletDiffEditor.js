import * as Diff from '../Diff/Diff.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Height from '../Height/Height.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    uri,
    linesLeft: [],
    linesRight: [],
    changes: [],
    top,
    left,
    width,
    height,
    minimumSliderSize: Height.MinimumSliderSize,
    scrollBarHeight: 0,
    rowHeight: 20,
  }
}

const getContents = (left, right) => {
  return Promise.all([FileSystem.readFile(left), FileSystem.readFile(right)])
}

export const loadContent = async (state) => {
  const { uri, top, left, width, height, minimumSliderSize, rowHeight } = state
  const uriContentPart = uri.slice('diff://'.length)
  const [uriLeft, uriRight] = uriContentPart.split('<->')
  const [contentLeft, contentRight] = await getContents(uriLeft, uriRight)
  const linesLeft = SplitLines.splitLines(contentLeft)
  const linesRight = SplitLines.splitLines(contentRight)
  const changes = Diff.diff(linesLeft, linesRight)

  const contentHeight =
    Math.max(linesLeft.length, linesRight.length) * rowHeight

  const scrollBarHeight = ScrollBarFunctions.getScrollBarHeight(
    height,
    contentHeight,
    minimumSliderSize
  )

  console.log({ scrollBarHeight })
  // const editorLeft = ViewletEditorText.create(
  //   '',
  //   uriLeft,
  //   left,
  //   top,
  //   width / 2,
  //   height
  // )
  // const editorRight = ViewletEditorText.create(
  //   '',
  //   uriRight,
  //   left + width / 2,
  //   width / 2,
  //   height
  // )
  return {
    ...state,
    linesLeft,
    linesRight,
    changes,
    scrollBarHeight,
  }
}

export const hasFunctionalRender = true

const renderLeft = {
  isEqual(oldState, newState) {
    return oldState.linesLeft === newState.linesLeft
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentLeft',
      /* linesLeft */ newState.linesLeft,
    ]
  },
}

const renderRight = {
  isEqual(oldState, newState) {
    return oldState.linesRight === newState.linesRight
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setContentRight',
      /* linesRight */ newState.linesRight,
    ]
  },
}

const renderChanges = {
  isEqual(oldState, newState) {
    return oldState.changes === newState.changes
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setChanges',
      /* contentLeft */ newState.changes,
    ]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.scrollBarHeight === newState.scrollBarHeight
  },
  apply(oldState, newState) {
    console.log('render scrollbar')
    // const scrollBarY = ScrollBarFunctions.getScrollBarY(
    //   newState.deltaY,
    //   newState.finalDeltaY,
    //   newState.height - newState.headerHeight,
    //   newState.scrollBarHeight
    // )
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.DiffEditor,
      /* method */ 'setScrollBar',
      /* scrollBarY */ 0,
      /* scrollBarHeight */ newState.scrollBarHeight,
    ]
  },
}

export const render = [renderLeft, renderRight, renderChanges, renderScrollBar]
