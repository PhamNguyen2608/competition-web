import React from 'react';
import { Helmet } from 'react-helmet-async';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // Gửi lỗi đến service như Sentry/Rollbar
    console.error('Application Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Thực hiện các hành động reset state tại đây
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <Helmet>
            <title>Error - Application Name</title>
            <meta name="description" content="Application error page" />
          </Helmet>

          <div style={styles.errorContent}>
            <h1 style={styles.heading}>Something went wrong.</h1>
            <pre style={styles.errorText}>
              {this.state.error?.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </pre>

            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={this.handleReset}>
                Try to recover
              </button>
              <button
                style={styles.button}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>

            <div style={styles.feedbackSection}>
              <p>Need immediate assistance?</p>
              <button 
                style={styles.feedbackButton}
                onClick={() => {/* Implement feedback logic */}}
              >
                Report Feedback
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  errorContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
  },
  errorContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  errorText: {
    whiteSpace: 'pre-wrap',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '5px',
    overflowX: 'auto',
  },
  buttonGroup: {
    marginTop: '30px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  feedbackSection: {
    marginTop: '40px',
    borderTop: '1px solid #721c24',
    paddingTop: '20px',
  },
  feedbackButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#721c24',
    border: '1px solid #721c24',
    borderRadius: '5px',
    cursor: 'pointer',
  },
} as const;

export default ErrorBoundary; 