import matchSorter from 'match-sorter'
import sortBy from 'lodash.sortby'
import { observable, computed, action } from 'mobx'

import TBObject from './TBObject'
import { wrapAround } from 'utils'

export default class TBObjectSource {
  @observable index = 0
  @observable loading = true
  @observable _items = []
  @observable input = undefined
  @observable searchTerm = []

  constructor(...sources) {
    this.sources = sources
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
  setInput(input) {
    this.index = 0
    this.searchTerm = []
    this.input = input
    this.refreshSources({ input })
  }

  @action
  browseToChildren() {
    this.sources = [this.selected]
    this.refreshSources({ forceHideSourceItem: true })
    this.index = 0
    this.searchTerm = []
  }

  @action
  refreshSources({ input = this.input, forceHideSourceItem } = {}) {
    this.loading = true
    Promise.all(
      this.sources.map(Source => {
        if (!forceHideSourceItem && Source.showSourceItem) {
          return Source
        } else if (Source.childResolver) {
          return Source.childResolver(input)
        } else {
          // this should not happen
          debugger
        }
      })
    ).then(
      action(items => {
        this._items = items
          .reduce((collection, item) => collection.concat(item), [])
          .map(item => (item instanceof TBObject ? item : new TBObject(item)))
        this.loading = false
      })
    )
  }
}
