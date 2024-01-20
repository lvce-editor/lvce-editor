import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'

export const getHeadersMainFrame = () => {
  return {
    [ContentSecurityPolicy.key]: ContentSecurityPolicy.value,
    [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
    [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
  }
}
