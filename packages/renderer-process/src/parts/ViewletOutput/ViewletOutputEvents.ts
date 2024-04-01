import * as ViewletOutputFunctions from './ViewletOutputFunctions.ts'

export const handleChange = (event) => {
  const $Target = event.target
  const value = $Target.value
  ViewletOutputFunctions.setOutputChannel(value)
}
