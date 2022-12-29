import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    error: false
  };

  componentDidCatch(error, info) {
    console.log({
      error,
      info
    });
    this.setState({
      error: true
    });
  }

  render() {
    if (this.state.error) {
      return <div className='error-container'>
        <div className='web-error mb-25'/>
        <p className='error-text'>페이지가 응답하지 않습니다.</p>
        <p className='error-text mb-50'>잠시후에 다시 시도하여주시기 바랍니다.</p>
      </div>
    }
    return this.props.children ?? <></>;
  }
}

export default ErrorBoundary;