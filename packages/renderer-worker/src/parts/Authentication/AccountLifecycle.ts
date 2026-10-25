interface Participant {
  readonly willChange: string
  readonly didChange: string
}
interface Extension {
  readonly disabled?: boolean
  readonly accountLifecycle?: Participant
  readonly commands?: readonly { readonly id: string }[]
}
interface Options {
  readonly getExtensions: () => Promise<readonly Extension[]>
  readonly execute: (command: string) => Promise<unknown>
}

// Keep the same participants until this operation ends, even if extension metadata changes.
export const createAccountLifecycle = (options: Options) => {
  const pending = new Map<number, readonly Participant[]>()
  let nextId = 0
  let changes = 0
  let generation = 0
  const notify = async (participants: readonly Participant[], phase: keyof Participant): Promise<void> => {
    await Promise.allSettled(participants.map((participant) => Promise.try(() => options.execute(participant[phase]))))
  }
  const beginAccountChange = async (): Promise<number> => {
    changes++
    generation++
    let extensions: readonly Extension[]
    try {
      extensions = await options.getExtensions()
    } catch {
      // Account management must remain available when extension discovery is offline.
      // The generation still invalidates pending authorization in any running extension.
      extensions = []
    }
    const participants = extensions.flatMap((extension) => {
      const participant = extension.accountLifecycle
      if (extension.disabled || !participant || typeof participant.willChange !== 'string' || typeof participant.didChange !== 'string') return []
      const commands = new Set(extension.commands?.map((command) => command.id))
      if (!commands.has(participant.willChange) || !commands.has(participant.didChange)) return []
      return [participant]
    })
    const id = ++nextId
    pending.set(id, participants)
    // Extensions dispose locally before attempting remote revocation. Offline revocation must not prevent sign-out.
    await notify(participants, 'willChange')
    return id
  }
  const endAccountChange = async (id: number): Promise<void> => {
    const participants = pending.get(id)
    if (!participants) return
    pending.delete(id)
    changes--
    await notify(participants, 'didChange')
  }
  const getAccountChangeState = () => ({ changing: changes > 0, generation })
  return { beginAccountChange, endAccountChange, getAccountChangeState }
}
