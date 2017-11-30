import glamorous from 'glamorous'
import * as glamor from 'glamor'

const Pulse = glamorous.div(({ delay = '0s', duration = '1s' }) => ({
  border: '2px solid ActiveBorder',
  borderRadius: 30,
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  animation: `${glamor.css.keyframes({
    '0%': { transform: 'scale(0)', opacity: 0.0 },
    '50%': { opacity: 0.8 },
    '100%': { transform: 'scale(1.2)', opacity: 0.0 },
  })} ${duration} ease-out`,
  animationDelay: delay,
  animationIterationCount: 'infinite',
  opacity: 0,
}))
