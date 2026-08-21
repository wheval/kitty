import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kitty crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>🐱💥 Something broke</h2>
            <p className="muted">
              Kitty hit an unexpected error. Reloading usually fixes it.
            </p>
            <p className="mono error">{this.state.error.message}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
