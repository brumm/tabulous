import { observe, observable, useStrict } from 'mobx'

import { onRemoved, onCreated, onUpdated, onMoved } from 'browser-api'
import { TBObject, TBObjectSource } from './TBObjects'
import {
  directObjectResolver,
  actionObjectResolver,
  indirectObjectResolver,
} from './resolvers'

useStrict(true)

class Sources {
  @observable directObjects = new TBObjectSource(directObjectResolver)
  @observable actionObjects = new TBObjectSource(actionObjectResolver)
  @observable indirectObjects = new TBObjectSource(indirectObjectResolver)

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

    onRemoved(() => this.directObjects.runResolver())
    onCreated(() => this.directObjects.runResolver())
    // onUpdated(() => this.directObjects.runResolver())
    onMoved(() => this.directObjects.runResolver())
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
