import matchSorter from 'match-sorter'
import sortBy from 'lodash.sortby'
import { observable, computed, action } from 'mobx'
import emptyIcon from 'img/icon-48.png'

import { wrapAround } from 'utils'

export class TBObjectSource {
  @observable index = 0
  @observable loading = true
  @observable _items = []
  @observable input = undefined
  @observable searchTerm = []

  constructor(resolver) {
    this.resolver = resolver
    this.setInput()
  }

  @computed
  get items() {
    return this.searchTerm.length
      ? matchSorter(this._items, this.searchTerm.join(''), {
          keys: ['name', 'details'],
        })
      : sortBy(this._items, ['meta.index', 'meta.windowId'])
  }

  @computed
  get selected() {
    if (this.items.length === 0) {
      return new TBObject()
    }
    return this.items[this.index] || new TBObject()
  }

  @action
  changeIndex(direction) {
    this.index = wrapAround(this.index + direction, this.items.length)
  }

  findById(...ids) {
    return this.items.filter(({ id }) => ids.includes(id))
  }

  @action
  setIndex(index) {
    this.index = index
  }

  @action
  pushSearchCharacter(character) {
    this.index = 0
    this.searchTerm.push(character)
  }

  @action
  setSearchTerm(searchTerm) {
    this.index = 0
    this.searchTerm = searchTerm
  }

  @action
  clearSearchTerm() {
    this.index = 0
    this.searchTerm = []
  }

  @action
  setInput(input, ...selectedObjects) {
    this.index = 0
    this.searchTerm = []
    this.input = input
    this.runResolver(input, selectedObjects)
  }

  @action
  browseToChildren() {
    this.setResolver(this.selected.childResolver)
    this.index = 0
    this.searchTerm = []
  }

  @action
  setResolver(resolver) {
    this.resolver = resolver
    this.runResolver()
  }

  @action
  runResolver(input = this.input, selectedObjects = {}) {
    this.loading = true
    this.resolver(input, ...selectedObjects).then(
      action(items => {
        this._items = items.map(item => new TBObject(item))
        this.loading = false
      })
    )
  }
}

export class TBObject {
  constructor(object = {}) {
    this.object = object
  }
  get id() {
    return this.object.id
  }
  get name() {
    return this.object.name
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

  // direct and indirect concerns
  get providesChildren() {
    return this.object.providesChildren
  }
  get childResolver() {
    return this.object.childResolver
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
