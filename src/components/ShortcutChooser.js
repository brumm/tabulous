import React from 'react'
import eventStringifier from 'key-event-to-string'
import PropTypes from 'proptypes'

export default class ShortcutPicker extends React.Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    onInvalid: PropTypes.func,
    modifierNeeded: PropTypes.bool,
    keyNeeded: PropTypes.bool,
    modifierChars: PropTypes.object,
    validate: PropTypes.func,
    selectInputOnClick: PropTypes.bool,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    onUpdate: () => {},
    onInvalid: () => {},
    onChange: () => {},
    modifierNeeded: true,
    keyNeeded: true,
    modifierChars: {},
    selectInputOnClick: true,
    validate: () => true,
    defaultValue: '',
  }

  state = {
    value: this.props.defaultValue,
    focused: false,
  }

  keyDown = e => {
    const { keyNeeded, modifierNeeded, modifierChars, validate } = this.props

    const event2string = eventStringifier(modifierChars)
    const eventDetails = eventStringifier.details

    const oldValue = e.target.value
    const newValue = event2string(e)

    if (newValue === 'Escape') {
      this.component.blur()
    }

    const { hasModifier, hasKey, map: { modifiers } } = eventDetails(e)
    const externalValidation = validate({
      key: newValue,
      hasModifier,
      hasKey,
      ...modifiers,
    })
    const isValid = (!keyNeeded || hasKey) && (!modifierNeeded || hasModifier)

    if (isValid && externalValidation) {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ value: newValue })
      if (newValue !== oldValue) {
        this.props.onUpdate(newValue, oldValue)
      }
    } else {
      this.props.onInvalid(newValue)
    }
  }

  render() {
    const { value, focused } = this.state
    const {
      component: Component = 'input',
      onUpdate,
      onInvalid,
      modifierNeeded,
      keyNeeded,
      modifierChars,
      validate,
      selectInputOnClick,
      defaultValue,
      ...inputProps
    } = this.props
    return (
      <Component
        type="text"
        placeholder={focused ? 'Type shortcut' : 'Click to record shortcut'}
        innerRef={node => (this.component = node)}
        value={defaultValue || value}
        onKeyDown={this.keyDown}
        onFocus={() =>
          this.setState({
            focused: true,
          })}
        onBlur={() =>
          this.setState({
            focused: false,
          })}
        {...inputProps}
      />
    )
  }
}
