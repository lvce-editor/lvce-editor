import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  '6532': ViewletSourceControl.acceptInput
}

export const Css = '/css/parts/ViewletSourceControl.css'

export * from './ViewletSourceControl.js'
