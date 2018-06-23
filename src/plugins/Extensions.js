import sortBy from 'lodash.sortby'

import TBObject from 'store/TBObject'
import {
  createTab,
  getAllExtensions,
  enableExtension,
  disableExtension,
  uninstallExtension,
} from 'browser-api'
import defaultActionIcon from 'img/icon-action'
import extensionsIcon from './icon-extensions'

const TYPES = {
  SOURCE: 'tabulous.source',
  EXTENSION_MANAGER: 'browser.extension-manager',
  EXTENSION: 'browser.extension',
}

const extensionResolver = directObject =>
  getAllExtensions().then(extensions =>
    sortBy(extensions, ['name'])
      .filter(({ type }) => type !== 'hosted_app')
      .map(
        extension =>
          new Extension({
            id: extension.id,
            name: extension.name,
            details: extension.description,
            type: [TYPES.EXTENSION],
            icon: `chrome://extension-icon/${extension.id}/128/0`,
            meta: {
              optionsUrl: extension.optionsUrl,
              enabled: extension.enabled,
            },
          })
      )
  )

const source = new TBObject({
  showSourceItem: true,
  name: 'Extensions',
  icon: extensionsIcon,
  type: [TYPES.SOURCE, TYPES.EXTENSION_MANAGER],
  childResolver: extensionResolver,
})

class Extension extends TBObject {
  enable() {
    enableExtension(this.id)
  }
  disable() {
    disableExtension(this.id)
  }
  uninstall() {
    uninstallExtension(this.id)
  }
}

const actions = [
  {
    name: 'Open Extensions',
    details: 'Open extensions in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.EXTENSION_MANAGER],
    execute: () => createTab({ url: 'chrome://extensions/' }),
  },
  {
    name: 'Open Options',
    details: 'Open options for this extension in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.EXTENSION],
    displayPredicate: directObject => directObject.meta.optionsUrl,
    execute: ([extension]) => createTab({ url: extension.meta.optionsUrl }),
  },
  {
    name: 'Enable',
    details: 'Enable extension',
    icon: defaultActionIcon,
    directTypes: [TYPES.EXTENSION],
    displayPredicate: directObject => !directObject.meta.enabled,
    execute: extensions => extensions.forEach(extension => extension.enable()),
  },
  {
    name: 'Disable',
    details: 'Disable extension',
    icon: defaultActionIcon,
    directTypes: [TYPES.EXTENSION],
    displayPredicate: directObject => directObject.meta.enabled,
    execute: extensions => extensions.forEach(extension => extension.disable()),
  },
  {
    name: 'Uninstall',
    details: 'Uninstall extension',
    icon: defaultActionIcon,
    directTypes: [TYPES.EXTENSION],
    execute: extensions =>
      extensions.forEach(extension => extension.uninstall()),
  },
]

export default {
  source,
  actions,
  permissions: ['management'],
}
