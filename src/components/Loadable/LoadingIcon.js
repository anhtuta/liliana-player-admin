import React from 'react';
import './LoadingIcon.scss';

/**
 * Ref: https://loading.io/css/
 */
const LoadingIcon = (props) => {
  const { show, fullscreen = true } = props;
  const className = fullscreen ? 'loading-fs' : '';
  return show ? (
    <div className={className}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null;
};

export default LoadingIcon;
