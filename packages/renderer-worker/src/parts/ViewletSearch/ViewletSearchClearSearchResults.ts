import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'
import type { SearchState } from './ViewletSearchTypes.ts'

export const clearSearchResults = async (state: SearchState): Promise<SearchState> => {
  await TextSearchViewWorker.invoke('TextSearch.clearSearchResults', state.uid)
  const commands = await TextSearchViewWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}
