import React from 'react';
import './Button.scss';

const Button = (props) => {
  const { text, onClick, disabled = false } = props;
  const className = props.className ? props.className : 'btn-success';
  const classes = `btn ${className}`;

  return (
    <button className={'btn ' + classes} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
