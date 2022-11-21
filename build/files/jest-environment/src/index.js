import { ModuleMocker } from 'jest-mock'
import { createContext } from 'node:vm'
import { vscode as api } from '@lvce-editor/server/static/COMMIT_HASH/packages/extension-host-worker/src/parts/Api/Api.js'

export default class CustomEnvironment {
  constructor() {
    this.global = globalThis
    this.global.vscode = api
    this.context = createContext(this.global)
    this.moduleMocker = new ModuleMocker(this.global)
  }

  setup() {}

  teardown() {
    // @ts-ignore
    this.context = null
  }

  getVmContext() {
    return this.context
  }
}
