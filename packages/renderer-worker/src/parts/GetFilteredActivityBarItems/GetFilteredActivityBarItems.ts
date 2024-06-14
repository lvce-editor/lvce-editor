import type { ActivityBarItem } from '../ActivityBarItem/ActivityBarItem.ts'
import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../Icon/Icon.js'
import { getNumberOfVisibleItems } from '../ViewletActivityBar/ViewletActivityBarGetHiddenItems.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'

export const getFilteredActivityBarItems = (items: readonly ActivityBarItem[], height: number, itemHeight: number): readonly ActivityBarItem[] => {
  const numberOfVisibleItems = getNumberOfVisibleItems({ height, itemHeight })
  if (numberOfVisibleItems >= items.length) {
    return items
  }
  const showMoreItem: ActivityBarItem = {
    id: 'Additional Views',
    title: ViewletActivityBarStrings.additionalViews(),
    icon: Icon.Ellipsis,
    flags: ActivityBarItemFlags.Button,
    keyShortcuts: '',
  }
  return [...items.slice(0, numberOfVisibleItems - 2), showMoreItem, items.at(-1)!]
}
