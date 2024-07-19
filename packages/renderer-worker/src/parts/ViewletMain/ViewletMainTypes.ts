import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'

export interface MainState {
  readonly activeGroupIndex: number
  readonly groups: readonly EditorGroup[]
  readonly focusedIndex: number
}

export interface MainStateResult {
  readonly newState: MainState
  readonly commands: any[]
}
