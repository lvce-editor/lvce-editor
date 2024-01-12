import * as Character from '../Character/Character.js'
import * as Diff from '../Diff/Diff.js'
import * as GetDiffEditorContents from '../GetDiffEditorContents/GetDiffEditorContents.js'
import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as Languages from '../Languages/Languages.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.js'

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
    languageLeft: '',
    languageRight: '',
    ...VirtualList.create({ itemHeight: 20 }),
  }
}

export const loadContent = async (state) => {
  const { uri, top, left, width, height, minimumSliderSize, itemHeight } = state
  const uriContentPart = uri.slice('diff://'.length)
  const [uriLeft, uriRight] = uriContentPart.split(Character.DiffSeparator)
  const { contentLeft, contentRight } = await GetDiffEditorContents.getDiffEditorContents(uriLeft, uriRight)

  // TODO query left language id somehow
  const languageRight = Languages.getLanguageId(uriRight)
  const languageLeft = languageRight

  await LoadTokenizers.loadTokenizers([languageLeft, languageRight])

  const linesLeft = SplitLines.splitLines(contentLeft)
  const linesRight = SplitLines.splitLines(contentRight)
  const changes = Diff.diff(linesLeft, linesRight)

  const total = Math.max(linesLeft.length, linesRight.length)
  const contentHeight = total * itemHeight

  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)

  const numberOfVisible = GetNumberOfVisibleItems.getNumberOfVisibleItems(height, itemHeight)
  const maxLineY = Math.min(numberOfVisible, total)

  const finalDeltaY = Math.max(contentHeight - height, 0)

  return {
    ...state,
    linesLeft,
    linesRight,
    changes,
    scrollBarHeight,
    finalDeltaY,
    maxLineY,
    languageLeft,
    languageRight,
  }
}
