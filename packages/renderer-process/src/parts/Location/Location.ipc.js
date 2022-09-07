import * as Command from '../Command/Command.js'
import * as Location from './Location.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.LOCATION_GET_HREF, Location.getHref)
  Command.register(CommandId.LOCATION_GET_PATH_NAME, Location.getPathName)
  Command.register(CommandId.LOCATION_HYDRATE, Location.hydrate)
  Command.register(CommandId.LOCATION_SET_PATH_NAME, Location.setPathName)
}
