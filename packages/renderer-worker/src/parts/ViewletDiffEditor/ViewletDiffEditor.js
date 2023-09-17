import * as Diff from '../Diff/Diff.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as Character from '../Character/Character.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uri,
    linesLeft: [],
    linesRight: [],
    changes: [],
    x,
    y,
    width,
    height,
    ...VirtualList.create({ itemHeight: 20 }),
  }
}

const getContents = (left, right) => {
  return Promise.all([FileSystem.readFile(left), FileSystem.readFile(right)])
}

export const loadContent = async (state) => {
  const { uri, top, left, width, height, minimumSliderSize, itemHeight } = state
  const uriContentPart = uri.slice('diff://'.length)
  const [uriLeft, uriRight] = uriContentPart.split(Character.DiffSeparator)
  const [contentLeft, contentRight] = await getContents(uriLeft, uriRight)
  const linesLeft = SplitLines.splitLines(contentLeft)
  const linesRight = SplitLines.splitLines(contentRight)
  const changes = Diff.diff(linesLeft, linesRight)

  const total = Math.max(linesLeft.length, linesRight.length)
  const contentHeight = total * itemHeight

  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)

  const numberOfVisible = Math.ceil(height / itemHeight)
  const maxLineY = Math.min(numberOfVisible, total)

  const finalDeltaY = Math.max(contentHeight - height, 0)

  console.log({ finalDeltaY })
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
    finalDeltaY,
    maxLineY,
  }
}
