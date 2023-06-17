import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../Icon/Icon.js'
import { getNumberOfVisibleItems } from '../ViewletActivityBar/ViewletActivityBarGetHiddenItems.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'

export const getVisibleActivityBarItems = (state) => {
  const numberOfVisibleItems = getNumberOfVisibleItems(state)
  const items = state.activityBarItems
  if (numberOfVisibleItems >= items.length) {
    return items
  }
  const showMoreItem = {
    id: 'Additional Views',
    title: ViewletActivityBarStrings.additionalViews(),
    icon: Icon.Ellipsis,
    enabled: true,
    flags: ActivityBarItemFlags.Button,
    keyShortCuts: '',
  }
  const visibleItems = [...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)]
  return visibleItems
}
