import * as IncrementalTextSearch from './IncrementalTextSearch.js'

export const name = 'IncrementalTextSearch'

export const Commands = {
  handleCanceled: IncrementalTextSearch.handleCanceled,
  handleData: IncrementalTextSearch.handleData,
  handleError: IncrementalTextSearch.handleError,
  handleExit: IncrementalTextSearch.handleExit,
  handleFinished: IncrementalTextSearch.handleFinished,
}
