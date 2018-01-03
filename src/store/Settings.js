import React from 'react'
import { observable, action } from 'mobx'

import { onStorageChanged, storageGet, storageSet } from 'browser-api'

export const initialState = {
  advancedMode: false,
  listWidth: 300,
  listItemHeight: 45,
  maxVisibleResults: 9.5,
  highlightColor: '#519AF5',
  markedColor: '#B8D7FB',
  markAllTabsShortcut: 'Ctrl + A',
  markItemShortcut: 'Ctrl + S',
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
  @observable markItemShortcut = initialState.markItemShortcut
  @observable closeTabShortcut = initialState.closeTabShortcut

  @observable needsSave = false

  constructor() {
    storageGet().then(settings => {
      this.set(settings, false)
    })
    onStorageChanged(
      action((changes, area) => {
        if (area === 'sync') {
          this.set(
            Object.keys(changes).reduce(
              (collection, key) => ({
                ...collection,
                [key]: changes[key].newValue,
              }),
              {}
            ),
            false
          )
        }
      })
    )
  }

  @action
  persist = (
    settings = {
      advancedMode: this.advancedMode,
      listWidth: this.listWidth,
      listItemHeight: this.listItemHeight,
      maxVisibleResults: this.maxVisibleResults,
      highlightColor: this.highlightColor,
      markedColor: this.markedColor,
      markAllTabsShortcut: this.markAllTabsShortcut,
      markItemShortcut: this.markItemShortcut,
      closeTabShortcut: this.closeTabShortcut,
    }
  ) => {
    storageSet(settings).then(
      action(() => {
        this.needsSave = false
      }),
      () => {
        debugger
      }
    )
  }

  @action
  set = (settings, trackSavedState = true) => {
    Object.keys(settings).forEach(key => {
      this[key] = settings[key]
    })
    if (trackSavedState) {
      this.needsSave = true
    }
  }
}

export default new Settings()
