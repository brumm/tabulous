export const initialState = {
  tabs: [],
  settings: {
    listWidth: 300,
    listItemHeight: 45,
    maxVisibleResults: 9.5,
    highlightColor: '#519AF5',
    markedColor: '#B8D7FB',
    markAllTabsShortcut: 'Ctrl + A',
    markTabShortcut: 'Ctrl + S',
    closeTabSortcut: 'Ctrl + D',
  },
  markedTabIds: [],
  filterText: '',
}

export default (state, { type, value }) => {
  // console.info('[state]', type, value)

  switch (type) {
    case 'SETTINGS_CHANGE':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...value,
        },
      }

    case 'UPDATE_TABS':
      return {
        ...state,
        tabs: value,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
