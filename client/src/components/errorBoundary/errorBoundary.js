import React, { Component } from 'react';

import { ErrorImageOverlay, ErrorImageContainer, ErrorImageText } from './errorBoundary.style';

class ErrorBoundary extends Component {
  constructor() {
    super();

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error) {
    if (error) return { hasError: true };
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return (
      hasError ?
        <ErrorImageOverlay>
          <ErrorImageContainer imageUrl="https://i.imgur.com/A040Lxr.png" />
          <ErrorImageText>This Page is Lost in Space</ErrorImageText>
        </ErrorImageOverlay>
        :
        children
    );
  }
}

export default ErrorBoundary;