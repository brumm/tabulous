import { observe, observable, useStrict } from 'mobx'

import { onRemoved, onCreated, onUpdated, onMoved } from 'browser-api'
import { TBObject, TBObjectSource } from './TBObjects'
import TabSource, { actions } from './plugins/Tabs'

import {
  directObjectResolver,
  actionObjectResolver,
  indirectObjectResolver,
} from './resolvers'

useStrict(true)

class Sources {
  @observable directObjects = new TBObjectSource(TabSource)
  @observable
  actionObjects = new TBObjectSource({
    childResolver: () => Promise.resolve(actions),
  })
  @observable
  indirectObjects = new TBObjectSource({
    childResolver: indirectObjectResolver,
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
