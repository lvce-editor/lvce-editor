import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

interface SearchInstance {
  readonly state: {
    readonly uid: number
  }
}

interface OpenTextSearchResult<State> {
  readonly commands: readonly any[]
  readonly newState: State
}

export interface OpenTextSearchDependencies<State> {
  readonly executeViewletCommand: (uid: number, command: string, ...args: readonly unknown[]) => Promise<void>
  readonly getInstance: (moduleId: string) => SearchInstance | undefined
  readonly getSelectionText: () => Promise<string>
  readonly openSideBarView: (state: State, moduleId: string) => Promise<OpenTextSearchResult<State>>
}

export const openTextSearch = async <State>(state: State, dependencies: OpenTextSearchDependencies<State>): Promise<OpenTextSearchResult<State>> => {
  const { executeViewletCommand, getInstance, getSelectionText, openSideBarView } = dependencies
  const selectedText = await getSelectionText()
  const result = await openSideBarView(state, ViewletModuleId.Search)
  const searchInstance = getInstance(ViewletModuleId.Search)
  if (!searchInstance) {
    return result
  }
  if (selectedText) {
    await executeViewletCommand(searchInstance.state.uid, 'handleInput', selectedText)
  }
  return {
    ...result,
    commands: [...result.commands, ['Viewlet.focusElementByName', searchInstance.state.uid, 'SearchValue']],
  }
}
