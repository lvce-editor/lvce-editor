import type { ActivityBarItem } from '../ActivityBarItem/ActivityBarItem.ts'

export interface ActivityBarState {
  readonly uid: number
  readonly activityBarItems: readonly ActivityBarItem[]
  readonly filteredItems: readonly ActivityBarItem[]
  readonly focusedIndex: number
  readonly selectedIndex: number
  readonly focused: boolean
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly itemHeight: number
  readonly commands: readonly any[]
}
