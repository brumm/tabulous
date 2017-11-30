import React from 'react'

import { getTabs, onRemoved, onCreated, onUpdated, onMoved } from 'chrome'

export default class SyncTabs extends React.Component {
  updateTabs = () =>
    getTabs().then(tabs =>
      this.props.dispatch({
        type: 'UPDATE_TABS',
        value: tabs,
      })
    )
  componentWillMount() {
    onRemoved(() => this.updateTabs())
    onCreated(() => this.updateTabs())
    onUpdated(() => this.updateTabs())
    onMoved(() => this.updateTabs())
    this.updateTabs()
  }
  render = () => this.props.children
}
