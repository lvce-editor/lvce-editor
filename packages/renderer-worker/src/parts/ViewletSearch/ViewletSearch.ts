import * as InputSource from '../InputSource/InputSource.js'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import type { SearchState } from './ViewletSearchTypes.ts'

export const create = (id: any, uri: string, x: number, y: number, width: number, height: number): SearchState => {
  return {
    uid: id,
    commands: [],
  }
}

export const loadContent = async (state: SearchState, savedState: any): Promise<SearchState> => {
  await TextSearchWorker.invoke('TextSearch.create', state.uid)
  await TextSearchWorker.invoke('TextSearch.loadContent', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const handleIconThemeChange = (state: SearchState): SearchState => {
  return {
    ...state,
  }
}

export const dispose = async (state: SearchState) => {
  return {
    ...state,
  }
}

// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results

export const handleInput = async (state: SearchState, value, inputSource = InputSource.Script) => {
  await TextSearchWorker.invoke('TextSearch.handleInput', state.uid, value, inputSource)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const submit = async (state: SearchState): Promise<SearchState> => {
  await TextSearchWorker.invoke('TextSearch.submit', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusSearchValue = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusSearchValue', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusSearchValueNext = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusSearchValueNext', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusMatchCasePrevious = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusMatchCasePrevious', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusReplaceValuePrevious = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusReplacePrevious', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusReplaceValueNext = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusReplaceNext', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusRegexNext = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusRegexNext', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusPreserveCasePrevious = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusPreserveCasePrevious', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusReplaceValue = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusReplaceValue', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusMatchCase = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusMatchCase', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusPreserveCase = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusPreserveCase', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusMatchWholeWord = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusMatchWholeWord', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusRegex = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusRegex', state.uid)
  return {
    ...state,
    commands,
  }
}

export const focusReplaceAll = async (state: SearchState): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.focusReplaceAll', state.uid)
  return {
    ...state,
    commands,
  }
}

export const handleFocusIn = async (state: SearchState, key: any): Promise<SearchState> => {
  const commands = await TextSearchWorker.invoke('TextSearch.handleFocusIn', state.uid, key)
  return {
    ...state,
    commands,
  }
}
