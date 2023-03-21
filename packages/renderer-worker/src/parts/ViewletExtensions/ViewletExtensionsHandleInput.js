import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as SearchExtensions from '../SearchExtensions/SearchExtensions.js'
import { getListHeight } from './ViewletExtensionsShared.js'
import * as ViewletExtensionsStrings from './ViewletExtensionsStrings.js'

// TODO debounce
export const handleInput = async (state, value) => {
  try {
    const { allExtensions, itemHeight, minimumSliderSize, height } = state
    // TODO cancel ongoing requests
    // TODO handle errors
    const items = await SearchExtensions.searchExtensions(allExtensions, value)
    if (items.length === 0) {
      return {
        ...state,
        items,
        minLineY: 0,
        deltaY: 0,
        allExtensions,
        maxLineY: 0,
        scrollBarHeight: 0,
        finalDeltaY: 0,
        message: ViewletExtensionsStrings.noExtensionsFound(),
        searchValue: value,
      }
    }
    const listHeight = getListHeight(state)
    const total = items.length
    const contentHeight = total * itemHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)
    const numberOfVisible = Math.ceil(listHeight / itemHeight)
    const maxLineY = Math.min(numberOfVisible, total)
    const finalDeltaY = Math.max(contentHeight - listHeight, 0)
    return {
      ...state,
      items,
      minLineY: 0,
      deltaY: 0,
      allExtensions,
      maxLineY,
      scrollBarHeight,
      finalDeltaY,
      message: '',
      searchValue: value,
    }

    // TODO handle out of order responses (a bit complicated)
    // for now just assume everything comes back in order
  } catch (error) {
    await ErrorHandling.handleError(error)
    return {
      ...state,
      searchValue: value,
      message: `${error}`,
    }
  }
}
