import React from 'react'

export class AppErrorBoundary extends React.Component {
    state = { hasError: false }
  
    componentDidCatch(error, info) {
      this.setState({ hasError: true })
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong. Refresh the page.</div>
      }
      return this.props.children
    }
  }