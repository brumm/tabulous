import TBObject from 'store/TBObject'
import {
  getBookmarks,
  removeBookmark,
  createTab,
  createWindow,
  createBookmark,
} from 'browser-api'
import defaultActionIcon from 'img/icon-action'
import bookmarkIcon from './icon-bookmark'

const TYPES = {
  SOURCE: 'tabulous.source',
  MANAGER: 'browser.bookmark-manager',
  FOLDER: 'browser.bookmark-folder',
  BOOKMARK: 'browser.bookmark',
  URL: 'public.url',
  TEXT_MODE: 'TEXT_MODE',
}

const flatten = (
  children,
  extractChildren = x => x.children,
  level = 1,
  parent = null
) =>
  Array.prototype.concat.apply(
    children.map(x => ({ ...x, level, parent })),
    children.map(x =>
      flatten(extractChildren(x) || [], extractChildren, level + 1, x.id)
    )
  )

const allBbookmarksResolver = id =>
  getBookmarks(id).then(treeRoot =>
    flatten(treeRoot)
      .filter(({ children }) => !children)
      .map(
        ({ id, title, children = [], ...meta }) =>
          new BookmarkNode({
            id,
            name: title,
            details:
              meta.url || (children.length && `${children.length} bookmarks`),
            icon: bookmarkIcon,
            type: meta.url ? [TYPES.BOOKMARK] : [TYPES.FOLDER],
            meta,
          })
      )
  )
const bookmarkResolver = id =>
  getBookmarks(id).then(([{ children }]) =>
    children.map(
      ({ id, title, children = [], ...meta }) =>
        new BookmarkNode({
          id,
          name: title,
          details:
            meta.url || (children.length && `${children.length} bookmarks`),
          icon: bookmarkIcon,
          childResolver: children.length > 0 && (() => bookmarkResolver(id)),
          type: meta.url ? [TYPES.BOOKMARK] : [TYPES.FOLDER],
          meta,
        })
    )
  )

const source = new TBObject({
  showSourceItem: true,
  name: 'Bookmarks',
  icon: bookmarkIcon,
  type: [TYPES.SOURCE, TYPES.MANAGER],
  childResolver: bookmarkResolver,
})

class BookmarkNode extends TBObject {
  open() {
    createTab({ url: this.meta.url })
  }
  remove() {
    removeBookmark(this.id)
  }
}

const actions = [
  {
    name: 'Open',
    details: 'Open bookmark in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.BOOKMARK],
    execute: bookmarks => bookmarks.forEach(bookmark => bookmark.open()),
  },
  {
    name: 'Remove',
    details: 'Remove bookmark',
    icon: defaultActionIcon,
    directTypes: [TYPES.BOOKMARK, TYPES.FOLDER],
    execute: bookmarks => bookmarks.forEach(bookmark => bookmark.remove()),
  },
  {
    name: 'Open Bookmark Manager',
    details: 'Open bookmark manager in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.MANAGER],
    execute: () => createTab({ url: 'chrome://bookmarks/' }),
  },
  {
    name: 'Open All Bookmarks',
    icon: defaultActionIcon,
    directTypes: [TYPES.FOLDER],
    execute: bookmarks =>
      bookmarks.forEach(({ id }) =>
        allBbookmarksResolver(id).then(bookmarks =>
          bookmarks.forEach(({ meta: { url } }) => createTab({ url }))
        )
      ),
  },
  {
    name: 'Open All Bookmarks In New Window',
    icon: defaultActionIcon,
    directTypes: [TYPES.FOLDER],
    execute: bookmarks =>
      bookmarks.forEach(({ id }) =>
        allBbookmarksResolver(id).then(bookmarks =>
          createWindow({ url: bookmarks.map(({ meta: { url } }) => url) })
        )
      ),
  },
  {
    name: 'Create Bookmark In...',
    details: 'Create bookmark for this url',
    icon: defaultActionIcon,
    directTypes: [TYPES.URL],
    indirectTypes: [TYPES.FOLDER],
    suggestedObjects: () => bookmarkResolver(),
    execute: (tabs, target) =>
      tabs.forEach(({ name, meta: { url } }) =>
        createBookmark({ parentId: target.id, index: 0, url, title: name })
      ),
  },
  {
    name: 'Save as Bookmarks...',
    details: 'Create bookmarks in folder for these tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.URL],
    indirectTypes: [TYPES.TEXT_MODE],
    suggestedObjects: () =>
      Promise.resolve([
        new TBObject({
          textMode: true,
          name: 'New Session',
          type: [TYPES.TEXT_MODE],
        }),
      ]),
    execute: (tabs, { name }) =>
      createBookmark({ title: name, index: 0 }).then(({ id }) =>
        Promise.all(
          tabs.map(({ name, meta: { url } }, index) =>
            createBookmark({ parentId: id, index, url, title: name })
          )
        ).then(() => tabs.forEach(tab => tab.close()))
      ),
  },
]

export default {
  source,
  actions,
  permissions: ['bookmarks'],
}
