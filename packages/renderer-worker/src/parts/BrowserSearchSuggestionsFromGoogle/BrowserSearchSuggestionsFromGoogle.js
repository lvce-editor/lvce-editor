import * as ElectronNet from '../ElectronNet/ElectronNet.js'

export const get = async (query) => {
  const language = 'en'
  const autoCompleteUrl = `https://google.com/complete/search?client=chrome&q=${query}&gl=${language}`
  const json = await ElectronNet.getJson(autoCompleteUrl)
  const suggestions = json[1]
  return suggestions
}
