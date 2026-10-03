import { setup } from '../fixtures/editor-cursor-split.js'

export const name = 'viewlet.main-editor-cursor-after-split-down'

export const test = async (api) => setup(api, 'Down')
