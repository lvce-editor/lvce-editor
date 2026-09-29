import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'
import * as IsSocket from '../IsSocket/IsSocket.ts'

export const transferrables = [IsMessagePort.isMessagePort, IsMessagePortMain.isMessagePortMain, IsSocket.isSocket]
