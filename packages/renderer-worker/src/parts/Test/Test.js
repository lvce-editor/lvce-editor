import { VError } from '../VError/VError.js'

export const state = {
  tests: [],
}

const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    throw new VError(error, `Failed to import script ${url}`)
  }
}

export const execute = async (href) => {
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await importScript(scriptUrl)
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
