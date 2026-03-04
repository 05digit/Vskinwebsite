import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-cream">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-gold mx-auto" />
            </div>

            {/* Error Message */}
            <h1 className="text-4xl md:text-5xl font-display text-brown-dark mb-4">
              Something Went Wrong
            </h1>
            
            <p className="text-brown text-lg mb-8 leading-relaxed max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-white border border-gold/20 rounded-lg text-left max-w-xl mx-auto">
                <p className="text-sm font-mono text-brown-dark break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleRefresh}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-gold text-white rounded-full hover:shadow-elevated transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-gold text-brown-dark rounded-full hover:bg-sand transition-all duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
