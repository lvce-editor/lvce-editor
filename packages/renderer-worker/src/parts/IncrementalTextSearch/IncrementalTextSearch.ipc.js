import * as IncrementalTextSearch from './IncrementalTextSearch.js'

export const name = 'IncrementalTextSearch'

export const Commands = {
  handleCanceled: IncrementalTextSearch.handleCanceled,
  handleError: IncrementalTextSearch.handleError,
  handleFinished: IncrementalTextSearch.handleFinished,
  handleExit: IncrementalTextSearch.handleExit,
  handleData: IncrementalTextSearch.handleData,
}
