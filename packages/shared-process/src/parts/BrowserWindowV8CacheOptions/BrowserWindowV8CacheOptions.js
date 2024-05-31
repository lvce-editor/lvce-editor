import * as IsProduction from '../IsProduction/IsProduction.js'
import * as V8CacheOptions from '../V8CacheOptions/V8CacheOptions.js'

export const browserWindowV8CacheOptions = IsProduction.isProduction ? V8CacheOptions.BypassHeatCheck : V8CacheOptions.None
