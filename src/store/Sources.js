import { observe, observable, configure } from 'mobx'

import { onRemoved, onCreated, onUpdated, onMoved } from 'browser-api'
import TBObject from './TBObject'
import TBCatalog from './TBCatalog'
import { uniqIds } from 'utils'

import {
  filterActionObjectsForDirectObject,
  suggestedIndirectObjectsForActionObject,
} from './plumbing'

configure({
  enforceActions: true,
})

class Sources {
  @observable directObjects = undefined
  @observable actionObjects = undefined
  @observable indirectObjects = undefined

  constructor(plugins) {
    const { sources, actions } = plugins.reduce(
      ({ sources, actions }, plugin) => ({
        sources: plugin.source ? [...sources, plugin.source] : sources,
        actions: [...actions, ...plugin.actions],
      }),
      { sources: [], actions: [] }
    )

    this.directObjects = new TBCatalog(sources)
    this.actionObjects = new TBCatalog([
      {
        childResolver: directObject =>
          filterActionObjectsForDirectObject({
            actions,
            directObject,
          }),
      },
    ])
    this.indirectObjects = new TBCatalog([
      {
        childResolver: actionObject =>
          suggestedIndirectObjectsForActionObject(actionObject),
      },
    ])

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
    onUpdated(() => this.directObjects.refreshSources())
    onMoved(() => this.directObjects.refreshSources())
  }

  getActiveSource(index) {
    return this[['directObjects', 'actionObjects', 'indirectObjects'][index]]
  }

  execute(markedItemIds) {
    this.actionObjects.selected.execute(
      uniqIds([
        this.directObjects.selected,
        ...this.directObjects.findById(...markedItemIds),
      ]),
      this.indirectObjects.selected
    )
    this.directObjects.refreshSources()
  }
}

export default Sources
