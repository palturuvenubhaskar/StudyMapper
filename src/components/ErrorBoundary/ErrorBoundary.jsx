import { Component, lazy, Suspense } from 'react';

const InternalError = lazy(() => import('../../pages/Errors/InternalError').then((module) => ({ default: module.InternalError })));

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Suspense fallback={null}>
          <InternalError 
            error={this.state.error} 
            errorInfo={this.state.errorInfo}
            onReset={this.handleReset}
          />
        </Suspense>
      );
    }
    return this.props.children;
  }
}
