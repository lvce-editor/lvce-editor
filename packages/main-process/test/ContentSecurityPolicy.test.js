const ContentSecurityPolicy = require('../src/parts/ContentSecurityPolicy/ContentSecurityPolicy.js')

test('contentSecurityPolicy - should have a strict default policy', () => {
  expect(ContentSecurityPolicy.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicy - should allow media', () => {
  expect(ContentSecurityPolicy.value).toContain(`media-src 'self'`)
})

test('contentSecurityPolicy - should allow fonts', () => {
  expect(ContentSecurityPolicy.value).toContain(`font-src 'self'`)
})

test('contentSecurityPolicy - should allow only local scripts', () => {
  expect(ContentSecurityPolicy.value).toContain(`script-src 'self'`)
})

test('contentSecurityPolicy - should allow images (local, https and data)', () => {
  expect(ContentSecurityPolicy.value).toContain(`img-src 'self' https: data:`)
})
