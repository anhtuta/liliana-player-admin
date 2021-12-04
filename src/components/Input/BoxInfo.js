import React from 'react';
import './Input.scss';

const BoxInfo = (props) => {
  const { label, className = '', children } = props;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-text-wrapper">{children}</div>
    </div>
  );
};

export default BoxInfo;
