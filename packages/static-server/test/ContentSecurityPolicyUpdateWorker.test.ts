import { expect, test } from '@jest/globals'
import { value } from '../src/parts/ContentSecurityPolicyUpdateWorker/ContentSecurityPolicyUpdateWorker.ts'

test('permits release metadata and asset downloads without allowing arbitrary connections', () => {
  const connect = value
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('connect-src '))
  expect(connect?.split(/\s+/).slice(1)).toEqual(['https://github.com', 'https://api.github.com', 'https://release-assets.githubusercontent.com'])
})
