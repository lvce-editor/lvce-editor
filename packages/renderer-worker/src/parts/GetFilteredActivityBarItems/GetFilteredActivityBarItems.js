import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../Icon/Icon.js'
import { getNumberOfVisibleItems } from '../ViewletActivityBar/ViewletActivityBarGetHiddenItems.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'

export const getFilteredActivityBarItems = (items, height, itemHeight) => {
  const numberOfVisibleItems = getNumberOfVisibleItems({ height, itemHeight })
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
  return [...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)]
}
