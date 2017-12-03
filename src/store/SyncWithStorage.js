import React from 'react'

import { onStorageChanged, storageGet } from 'chrome'

export default class SyncWithStorage extends React.Component {
  componentWillMount = () => {
    onStorageChanged(
      (changes, area) =>
        area === 'sync' &&
        this.props.dispatch({
          type: 'SETTINGS_CHANGE',
          value: Object.keys(changes).reduce(
            (collection, key) => ({
              ...collection,
              [key]: changes[key].newValue,
            }),
            {}
          ),
        })
    )

    storageGet(null).then(settings =>
      this.props.dispatch({
        type: 'SETTINGS_CHANGE',
        value: settings,
      })
    )
  }

  render = () => this.props.children
}
