import { hasIntersections } from 'utils'

export const filterActionObjectsForDirectObject = ({ actions, directObject }) =>
  Promise.resolve(
    actions.filter(({ directTypes, displayPredicate }) => {
      if (!directObject) return false
      const shouldDisplay = displayPredicate && displayPredicate(directObject)
      const doesIntersect = hasIntersections(directTypes, directObject.type)
      if (displayPredicate) {
        return doesIntersect && shouldDisplay
      } else {
        return doesIntersect
      }
    })
  )

export const suggestedIndirectObjectsForActionObject = (actionObject = {}) =>
  actionObject.suggestedObjects
    ? actionObject
        .suggestedObjects()
        .then(items =>
          items.filter(({ type }) =>
            hasIntersections(actionObject.indirectTypes, type)
          )
        )
    : Promise.resolve([])
