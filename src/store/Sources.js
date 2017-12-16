import { observe, observable, useStrict } from 'mobx'

import { onRemoved, onCreated, onUpdated, onMoved } from 'browser-api'
import TBObject from './TBObject'
import TBCatalog from './TBCatalog'
import TabSource, { actions } from './plugins/Tabs'

import {
  filterActionObjectsForDirectObject,
  suggestedIndirectObjectsForActionObject,
} from './plumbing'

useStrict(true)

class Sources {
  @observable directObjects = new TBCatalog(TabSource)

  @observable
  actionObjects = new TBCatalog({
    childResolver: directObject =>
      filterActionObjectsForDirectObject({ actions, directObject }),
  })

  @observable
  indirectObjects = new TBCatalog({
    childResolver: actionObject =>
      suggestedIndirectObjectsForActionObject(actionObject),
  })

  constructor() {
    observe(this.directObjects, 'selected', ({ newValue }) =>
      this.actionObjects.setInput(newValue)
    )

    observe(this.actionObjects, 'selected', ({ newValue }) =>
      this.indirectObjects.setInput(newValue, {
        directObject: this.directObjects.selected,
        actionObject: this.actionObjects.selected,
        indirectObject: this.indirectObjects.selected,
      })
    )

    // TODO sources should be able to refresh all sources
    // or even only themselves
    onRemoved(() => this.directObjects.refreshSources())
    onCreated(() => this.directObjects.refreshSources())
    // onUpdated(() => this.directObjects.refreshSources())
    onMoved(() => this.directObjects.refreshSources())
  }

  getActiveSource(index) {
    return this[['directObjects', 'actionObjects', 'indirectObjects'][index]]
  }

  execute(markedTabIds) {
    this.actionObjects.selected.execute(
      [
        this.directObjects.selected,
        ...this.directObjects.findById(...markedTabIds),
      ],
      this.indirectObjects.selected
    )
  }
}

const sources = (window.sources = new Sources())
export default sources
