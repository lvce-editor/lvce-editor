import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicyChatToolWorker from '../src/parts/ContentSecurityPolicyChatToolWorker/ContentSecurityPolicyChatToolWorker.js'

test('chat tool worker allows same-origin connections', () => {
  expect(ContentSecurityPolicyChatToolWorker.value).toBe("default-src 'none'; connect-src 'self'; sandbox allow-same-origin;")
})
