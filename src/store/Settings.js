import React from 'react'
import { observable, action } from 'mobx'

import { onStorageChanged, storageGet } from 'browser-api'

export const initialState = {
  advancedMode: false,
  listWidth: 300,
  listItemHeight: 45,
  maxVisibleResults: 9.5,
  highlightColor: '#519AF5',
  markedColor: '#B8D7FB',
  markAllTabsShortcut: 'Ctrl + A',
  markTabShortcut: 'Ctrl + S',
  closeTabShortcut: 'Ctrl + D',
}

class Settings {
  @observable advancedMode = initialState.advancedMode
  @observable listWidth = initialState.listWidth
  @observable listItemHeight = initialState.listItemHeight
  @observable maxVisibleResults = initialState.maxVisibleResults
  @observable highlightColor = initialState.highlightColor
  @observable markedColor = initialState.markedColor
  @observable markAllTabsShortcut = initialState.markAllTabsShortcut
  @observable markTabShortcut = initialState.markTabShortcut
  @observable closeTabShortcut = initialState.closeTabShortcut

  constructor() {
    storageGet().then(this.set)
    onStorageChanged((changes, area) => {
      if (area === 'sync') {
        this.set(
          Object.keys(changes).reduce(
            (collection, key) => ({
              ...collection,
              [key]: changes[key].newValue,
            }),
            {}
          )
        )
      }
    })
  }

  @action
  set = settings =>
    Object.keys(settings).forEach(key => {
      this[key] = settings[key]
    });
}

export default new Settings()
