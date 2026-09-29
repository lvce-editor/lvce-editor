import { join } from 'node:path'
import { root } from '../Root/Root.ts'

export const STATIC = process.env.LVCE_STATIC_ROOT || join(root, 'static')
