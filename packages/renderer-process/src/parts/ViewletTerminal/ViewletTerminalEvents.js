import * as Focus from '../Focus/Focus.js'
import * as ViewletTerminalFunctions from './ViewletTerminalFunctions.js'
import * as FocusKey from '../FocusKey/FocusKey.js'

export const handleInput = (input) => {
  ViewletTerminalFunctions.handleInput(input)
}

export const handleFocus = () => {
  Focus.setFocus(FocusKey.Terminal)
}
