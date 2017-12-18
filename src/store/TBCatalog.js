import matchSorter from 'match-sorter'
import sortBy from 'lodash.sortby'
import { observable, computed, action } from 'mobx'

import TBObject from './TBObject'
import { wrapAround } from 'utils'

export default class TBCatalog {
  @observable index = 0
  @observable loading = true
  @observable _items = []
  @observable input = undefined
  @observable searchTerm = []
  browsingHistory = []

  constructor(sources) {
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
    if (this.searchTerm.length === 0) {
      this.refreshSources({
        forceHideSourceItem: true,
      })
    }
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
    this.refreshSources()
    this.index = 0
    this.searchTerm = []
  }

  @action
  setInput(input) {
    this.index = 0
    this.searchTerm = []
    this.input = input
    this.refreshSources()
  }

  @action
  browseToParent() {
    if (this.browsingHistory.length) {
      const { sources, index, searchTerm } = this.browsingHistory.pop()
      this.sources = sources
      this.refreshSources({
        forceHideSourceItem: this.browsingHistory.length !== 0,
      })
      this.index = index
      this.searchTerm = searchTerm
    }
  }

  @action
  browseToChildren() {
    this.browsingHistory.push({
      sources: this.sources,
      index: this.index,
      searchTerm: this.searchTerm,
    })
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
