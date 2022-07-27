import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Location from '../Location/Location.js'
import { VError } from '../VError/VError.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'

export const state = {
  tests: [],
}

const getScriptToImport = async () => {
  // const href = await Location.getHref()
  // return RendererProcess.invoke('Document.')
  return `/packages/extension-host-worker-tests/src/sample.reference-provider-error.js`
}

const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    throw new VError(error, `Failed to import script ${url}`)
  }
}

export const execute = async () => {
  console.log('test/execute')
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = await getScriptToImport()
  // 2. import that script
  const module = await importScript(scriptUrl)
  // 3. if import fails, display error message
  console.log({ module })

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
