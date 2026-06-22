"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ContentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 text-center text-sm opacity-50">
          Content failed to load. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ContentErrorBoundary;
