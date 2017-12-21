import intersection from 'lodash/intersection'

export const wrapAround = (value, bounds) => (value % bounds + bounds) % bounds

export const transformShortcut = shortcut =>
  shortcut.replace(/\s/g, '').toLowerCase()

export const hasIntersections = (typeA, typeB) =>
  typeA && typeB && intersection(typeA, typeB).length > 0

export const uniqObjects = objects =>
  objects.filter(
    (objectA, index, array) =>
      index === array.findIndex(objectB => objectA.id === objectB.id)
  )

export const uniqIds = ids => ids.filter((el, i, a) => i === a.indexOf(el))
