import * as ViewletOutputFunctions from './ViewletOutputFunctions.js'

export const handleChange = (event) => {
  const $Target = event.target
  const value = $Target.value
  ViewletOutputFunctions.setOutputChannel(value)
}
