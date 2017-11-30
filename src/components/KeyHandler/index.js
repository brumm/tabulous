import React from 'react'

import { KEYDOWN, KEYPRESS, KEYUP } from './constants'
import { isInput, matchesKeyboardEvent, eventKey } from './utils'

/**
 * KeyHandler component.
 */

export default class KeyHandler extends React.Component {
  static propTypes = {
    keyValue: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.string,
      React.PropTypes.instanceOf(RegExp),
    ]),
    keyCode: React.PropTypes.number,
    preventDefault: React.PropTypes.bool,
    keyEventName: React.PropTypes.oneOf([KEYDOWN, KEYPRESS, KEYUP]),
    onKeyHandle: React.PropTypes.func,
  }

  static defaultProps = {
    preventDefault: false,
    keyEventName: KEYDOWN,
  }

  shouldComponentUpdate() {
    return false
  }

  constructor(props) {
    super(props)

    if (!props.keyValue && !props.keyCode) {
      console.error(
        'Warning: Failed propType: Missing prop `keyValue` or `keyCode` for `KeyHandler`.'
      )
    }
  }

  componentDidMount() {
    window.document.addEventListener(this.props.keyEventName, this.handleKey)
  }

  componentWillUnmount() {
    window.document.removeEventListener(this.props.keyEventName, this.handleKey)
  }

  render() {
    return null
  }

  handleKey = event => {
    const { keyValue, keyCode, onKeyHandle, preventDefault } = this.props
    if (!onKeyHandle) {
      return
    }

    const { target } = event

    // if (target instanceof window.HTMLElement && isInput(target)) {
    //   return
    // }

    if (!matchesKeyboardEvent(event, { keyValue, keyCode })) {
      return
    }

    if (preventDefault) {
      event.preventDefault()
    }

    onKeyHandle(event)
  }
}

/**
 * KeyHandler decorators.
 */

function keyHandleDecorator(matcher) {
  return props => {
    const { keyValue, keyCode, keyEventName } = props || {}

    return Component =>
      class KeyHandleDecorator extends React.Component {
        state = {
          keyValue: null,
          keyCode: null,
        }

        render() {
          return (
            <div>
              <KeyHandler
                keyValue={keyValue}
                keyCode={keyCode}
                keyEventName={keyEventName}
                onKeyHandle={this.handleKey}
              />
              <Component {...this.props} {...this.state} />
            </div>
          )
        }

        handleKey = event => {
          if (matcher && matcher(event, this.state)) {
            this.setState({ keyValue: null, keyCode: null })
            return
          }

          this.setState({ keyValue: eventKey(event), keyCode: event.keyCode })
        }
      }
  }
}

export const keyHandler = keyHandleDecorator()
export const keyToggleHandler = keyHandleDecorator(matchesKeyboardEvent)

/**
 * Constants
 */

export * from './constants'
