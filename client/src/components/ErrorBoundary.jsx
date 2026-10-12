import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', fontFamily: 'monospace', background: '#fff', color: '#b91c1c', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
            ⚠️ Application Render Error Caught:
          </h2>
          <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap', color: '#7f1d1d' }}>
              {this.state.error?.stack}
            </pre>
          </div>
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#450a0a' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>Component Stack Trace</summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
