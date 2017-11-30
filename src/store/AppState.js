import React, { Component } from 'react'
import { Broadcast, Subscriber } from 'react-broadcast'

const CHANNEL = '__APP_STATE__'

export class AppStateProvider extends Component {
  static propTypes = {
    reducer: () => undefined,
    defaultValue: () => undefined,
  }

  state = {
    value: this.props.reducer(this.props.defaultValue, { type: '@INIT' }),
  }

  dispatch = action =>
    this.setState(state => ({
      value: this.props.reducer(state.value, action),
    }))

  render() {
    return (
      <Broadcast
        channel={CHANNEL}
        value={{
          dispatch: this.dispatch,
          value: this.state.value,
        }}
      >
        {this.props.children}
      </Broadcast>
    )
  }
}

export const AppState = ({ children }) => (
  <Subscriber channel={CHANNEL} children={children} />
)

export const Middleware = ({ children, component: Component }) => (
  <AppState>
    {appState => <Component {...appState} children={children} />}
  </AppState>
)
