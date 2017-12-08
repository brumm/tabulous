import React from 'react'
import glamorous from 'glamorous'

const Ellipsis = glamorous(glamorous.Div)({
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})
export default Ellipsis
