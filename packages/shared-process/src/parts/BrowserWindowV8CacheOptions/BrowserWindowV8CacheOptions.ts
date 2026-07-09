import * as IsProduction from '../IsProduction/IsProduction.ts'
import * as V8CacheOptions from '../V8CacheOptions/V8CacheOptions.ts'

export const browserWindowV8CacheOptions = IsProduction.isProduction ? V8CacheOptions.BypassHeatCheck : V8CacheOptions.None
