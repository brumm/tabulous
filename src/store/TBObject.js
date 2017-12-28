import emptyIcon from 'img/icon-48.png'

export default class TBObject {
  constructor(object = {}) {
    this.object = {
      id: Math.random()
        .toString(36)
        .substr(2),
      ...object,
    }
  }
  get id() {
    return this.object.id
  }
  get name() {
    return this.object.name
  }
  set name(name) {
    this.object.name = name
  }
  get details() {
    return this.object.details || this.object.path
  }
  get type() {
    return this.object.type
  }
  get icon() {
    return this.object.icon || this.object.path || emptyIcon
  }
  get meta() {
    return this.object.meta || {}
  }

  get showSourceItem() {
    return this.object.showSourceItem
  }

  // direct and indirect concerns
  get childResolver() {
    return this.object.childResolver
  }

  // indirect concerns
  get textMode() {
    return this.object.textMode
  }

  // action concerns
  execute(direct, indirect) {
    this.object.execute && this.object.execute(direct, indirect)
  }
  get suggestedObjects() {
    return this.object.suggestedObjects
  }
  get indirectTypes() {
    return this.object.indirectTypes
  }
  get directTypes() {
    return this.object.directTypes
  }
}
