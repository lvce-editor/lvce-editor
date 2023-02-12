import * as Focus from '../Focus/Focus.js'
import * as ViewletTerminalFunctions from './ViewletTerminalFunctions.js'

export const handleInput = (input) => {
  ViewletTerminalFunctions.handleInput(input)
}

export const handleFocus = () => {
  Focus.setFocus('terminal')
}
