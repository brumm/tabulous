import TBObject from 'store/TBObject'
import { getBookmarks, removeBookmark, createTab } from 'browser-api'
import defaultActionIcon from 'img/icon-action'

const TYPES = {
  MANAGER: 'browser.bookmark-manager',
  FOLDER: 'browser.bookmark-folder',
  BOOKMARK: 'browser.bookmark',
  URL: 'public.url',
}

const bookmarkResolver = id =>
  getBookmarks(id).then(([{ children }]) =>
    children.map(
      ({ id, title, children = [], ...meta }) =>
        new BookmarkNode({
          id,
          name: title,
          details:
            meta.url || (children.length && `${children.length} bookmarks`),
          childResolver: children.length > 0 && (() => bookmarkResolver(id)),
          type: meta.url ? [TYPES.URL, TYPES.BOOKMARK] : [TYPES.FOLDER],
          meta,
        })
    )
  )

export default new TBObject({
  showSourceItem: true,
  name: 'Bookmarks',
  type: [TYPES.MANAGER],
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

export const bookmarkActions = [
  {
    name: 'Open',
    details: 'Open url in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.URL],
    execute: bookmarks => bookmarks.forEach(bookmark => bookmark.open()),
  },
  {
    name: 'Remove',
    details: 'Remove bookmark',
    icon: defaultActionIcon,
    directTypes: [TYPES.BOOKMARK],
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
    execute: console.log,
  },
  {
    name: 'Open All Bookmarks In New Window',
    icon: defaultActionIcon,
    directTypes: [TYPES.FOLDER],
    execute: console.log,
  },
]
