import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'

export const getHeadersOtherWorker = () => {
  return {
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
  }
}
