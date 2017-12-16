import { hasIntersections } from 'utils'

export const filterActionObjectsForDirectObject = ({
  actions,
  directObject = {},
}) =>
  Promise.resolve(
    actions.filter(({ directTypes }) =>
      hasIntersections(directTypes, directObject.type)
    )
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
