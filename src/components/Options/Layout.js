import glamorous from 'glamorous'
import { triangle } from 'polished'

import smallIcon from 'img/icon-24.png'

export const Container = glamorous.div({
  display: 'flex',
})

export const Left = glamorous.div({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 'auto',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
})

export const Right = glamorous.div({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 'auto',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const FakeToolbar = glamorous.div({
  width: '100%',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const FakeToolbarIcon = glamorous.div({
  width: 25,
  height: 24,
  borderRadius: 3,
  backgroundColor: '#D4D4D4',
  backgroundImage: `url(${smallIcon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center 40%',
  backgroundSize: '75%',
})

export const FakePopupFrame = glamorous.div({
  position: 'relative',
  overflow: 'visible',
  top: -4,
  borderRadius: 3,
  border: '1px solid #fff',
  backgroundColor: '#fff',
  filter: `
    drop-shadow(0 0px 5px rgba(0, 0, 0, 0.1))
    drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))
  `,
  boxShadow: `
    0 0 0 1px rgba(0, 0, 0, 0.15)
  `,
  ':after': {
    content: "''",
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 1,
    ...triangle({
      pointingDirection: 'top',
      width: 16,
      height: 9,
      foregroundColor: 'white',
    }),
  },
  ':before': {
    content: "''",
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 2,
    ...triangle({
      pointingDirection: 'top',
      width: 18,
      height: 10,
      foregroundColor: 'rgba(0, 0, 0, 0.15)',
    }),
  },
})