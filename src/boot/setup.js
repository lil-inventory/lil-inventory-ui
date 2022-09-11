import { boot } from 'quasar/wrappers'
import { LilInventoryClient } from '../client/lil-inventory-client'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app } ) => {
  app.config.globalProperties.$client = createClient()
})

function createClient() {
  // TODO get properties file envoirnment file
  return new LilInventoryClient('http://localhost:8080/')
}
