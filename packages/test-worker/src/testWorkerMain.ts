import * as Main from './parts/Main/Main.ts'

Main.main()

setTimeout(() => {
  throw new Error('oops')
}, 1000)
