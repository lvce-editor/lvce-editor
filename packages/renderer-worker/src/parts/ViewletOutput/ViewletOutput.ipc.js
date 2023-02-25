import * as ViewletOutput from './ViewletOutput.js'

export const name = 'Output'

export const Commands = {
  handleData: ViewletOutput.handleData,
  handleError: ViewletOutput.handleError,
}

export const Css = '/css/parts/ViewletOutput.css'

export * from './ViewletOutput.js'
export * from './ViewletOutputActions.js'
