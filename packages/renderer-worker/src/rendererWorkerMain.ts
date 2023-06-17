import * as Workbench from './parts/Workbench/Workbench.ts'

let x: number = 123
const main = async () => {
  await Workbench.startup()
}

main()
