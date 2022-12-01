import * as Workbench from './parts/Workbench/Workbench.js'

const main = async () => {
  if (globalThis.DONT_EXECUTE) {
    return
  }
  await Workbench.startup({})
}

main()
