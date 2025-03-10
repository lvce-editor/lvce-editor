import type { IframeInspectorState } from './ViewletIframeInspectorTypes.ts'

export const create = (): IframeInspectorState => {
  return {
    id: 1,
  }
}

export const loadContent = async (state: IframeInspectorState): Promise<IframeInspectorState> => {
  return state
}
