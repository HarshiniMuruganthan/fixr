import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="font-display text-xl font-bold text-dark-900 dark:text-dark-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-dark-400 dark:text-dark-500 max-w-sm mb-6">
            {this.state.error?.message || 'An unexpected error occurred in this section.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary text-sm"
            >
              Try Again
            </button>
            <Link to="/dashboard" className="btn-secondary text-sm">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
