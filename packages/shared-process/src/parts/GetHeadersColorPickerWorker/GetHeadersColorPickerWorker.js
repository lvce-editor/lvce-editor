import * as ContentSecurityPolicyColorPickerWorker from '../ContentSecurityPolicyColorPickerWorker/ContentSecurityPolicyColorPickerWorker.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'

export const getHeadersColorPickerWorker = () => {
  return {
    [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
    [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyColorPickerWorker.value,
  }
}
