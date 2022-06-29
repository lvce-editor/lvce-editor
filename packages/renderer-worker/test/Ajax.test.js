beforeAll(() => {
  // @ts-ignore https://github.com/jsdom/jsdom/issues/1724
  globalThis.Response = class {
    constructor(value, init) {
      this.value = value
      this.init = init
    }

    async json() {
      return JSON.parse(this.value)
    }
  }
})

afterAll(() => {
  // @ts-ignore
  delete globalThis.Response
})

// TODO how to test this? probably need mock server or mock service worker
test('getJson', async () => {
  // Ajax.state.getJson = jest.fn(async () => {
  //   return {
  //     x: 42,
  //   }
  // })
  // expect(await Ajax.getJson('https://example.com')).toEqual({ x: 42 })
  // expect(Ajax.state.getJson).toHaveBeenCalledWith('https://example.com', {})
})

// TODO how to test this? probably need mock server or mock service worker
test('getJson - error', async () => {
  // Ajax.state.getJson = jest.fn(() => {
  //   throw new SyntaxError('Unexpected token')
  // })
  // await expect(Ajax.getJson('https://example.com')).rejects.toThrowError(
  //   new Error(
  //     'Failed to request json from "https://example.com": Unexpected token'
  //   )
  // )
})

test('getJson - error - too many requests', async () => {
  // Ajax.state.getJson = jest.fn(() => {
  //   throw new HTTPError(
  //     new Response(
  //       '{"message":"API rate limit exceeded for 0.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)","documentation_url":"https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"}',
  //       {
  //         status: 403,
  //       }
  //     )
  //   )
  // })
  // await expect(Ajax.getJson('https://example.com')).rejects.toThrowError(
  //   new Error(
  //     'Failed to request json from "https://example.com": API rate limit exceeded for 0.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
  //   )
  // )
})
