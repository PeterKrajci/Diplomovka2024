import { Component, ReactNode } from 'react';

import { GeneralError } from './GeneralError';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback = <GeneralError /> } = this.props;

    if (hasError) {
      return fallback || null;
    }

    return children;
  }
}
