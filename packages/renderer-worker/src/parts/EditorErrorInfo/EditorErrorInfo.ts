import type { EditorErrorInfoAction } from '../EditorErrorInfoAction/EditorErrorInfoAction.ts'

export interface EditorErrorInfo {
  readonly type: number
  readonly message: string
  readonly actions: readonly EditorErrorInfoAction[]
}
