import intersection from 'lodash/intersection'

export const wrapAround = (value, bounds) => (value % bounds + bounds) % bounds

export const transformShortcut = shortcut =>
  shortcut.replace(/\s/g, '').toLowerCase()

export const hasIntersections = (typeA, typeB) =>
  typeA && typeB && intersection(typeA, typeB).length > 0
