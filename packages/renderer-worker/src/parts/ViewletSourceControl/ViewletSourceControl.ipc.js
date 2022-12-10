import * as ViewletSourceControl from './ViewletSourceControl.js'

export const name = 'Source Control'

// prettier-ignore
export const Commands = {
  acceptInput: ViewletSourceControl.acceptInput
}

export const Css = [
  '/css/parts/ViewletSourceControl.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletSourceControl.js'
