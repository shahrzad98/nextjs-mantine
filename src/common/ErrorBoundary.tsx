import ErrorPage404 from "@/pages/404";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    // Define a state variable to track whether there is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error({ error, errorInfo });
  }

  render() {
    // Check if there was an error
    if (this.state.hasError) {
      return (
        <div>
          <ErrorPage404 />
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
