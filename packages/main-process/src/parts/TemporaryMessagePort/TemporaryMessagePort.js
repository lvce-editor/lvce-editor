// TODO
// In order to create utility process from shared process
// create a message channel in the main process and
// send one port to the shared process and the other port
// to the utilityprocess that should be created.
// Then send the other message port that has been sent from renderer worker
// to renderer process to shared process onto the message port
// that was created in the main process to the new utility process
// The message ports in main process only exist temporarily
// because they are sent to the shared process/utility process
export const create = () => {
  console.log('create temporary message port')
}
