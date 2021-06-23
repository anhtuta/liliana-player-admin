import React from 'react';
import './LoadingIcon.scss';

const LoadingIcon = () => {
  return (
    <div className="lds-roller-wrapper">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingIcon;
