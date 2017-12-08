export const wrapAround = (value, bounds) => (value % bounds + bounds) % bounds

export const transformShortcut = shortcut =>
  shortcut.replace(/\s/g, '').toLowerCase()
