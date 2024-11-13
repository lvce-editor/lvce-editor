import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import type { SearchState } from './ViewletSearchTypes.ts'

export const clearSearchResults = async (state: SearchState): Promise<SearchState> => {
  await TextSearchWorker.invoke('TextSearch.clearSearchResults', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
