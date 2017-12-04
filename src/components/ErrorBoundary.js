import React from 'react'
import glamorous from 'glamorous'

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://ddb60bba86fe4ac382b0139e699e45eb@sentry.io/254233', {
    release: process.env.VERSION,
  }).install()
}

const Container = glamorous.div({
  height: 45,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export default class ErrorBoundary extends React.Component {
  state = { error: null }

  componentDidCatch(error, errorInfo) {
    const { settings } = this.props
    if (process.env.NODE_ENV === 'production') {
      this.setState({ error })
      Raven.captureException(error, { extra: { errorInfo, settings } })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Container>
          <p>We're sorry - something's gone wrong.</p>
        </Container>
      )
    } else {
      return this.props.children
    }
  }
}
