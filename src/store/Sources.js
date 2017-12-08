import { observe, observable, useStrict } from 'mobx'

import { onRemoved, onCreated, onUpdated, onMoved } from 'browser-api'
import { QTObject, QTObjectSource } from './QTObjects'
import {
  directObjectResolver,
  actionObjectResolver,
  indirectObjectResolver,
} from './resolvers'

useStrict(true)

class Sources {
  @observable directObjects = new QTObjectSource(directObjectResolver)
  @observable actionObjects = new QTObjectSource(actionObjectResolver)
  @observable indirectObjects = new QTObjectSource(indirectObjectResolver)

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
    onUpdated(() => this.directObjects.runResolver())
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

export default new Sources()
