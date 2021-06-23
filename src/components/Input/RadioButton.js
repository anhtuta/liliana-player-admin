import React from 'react';
import './RadioButton.scss';

/**
 * Ref: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_custom_radio
 */
const RadioButton = (props) => {
  const {
    label,
    name,
    value,
    className = '',
    labelClassName = '',
    checked = false,
    disabled = false
  } = props;
  const classes =
    `custom-radio-wrapper ${className}` + (disabled ? ' custom-radio-disabled' : '');
  const labelClasses = `custom-radio-container ${labelClassName}`;

  const onChange = (e) => {
    props.onChange({
      name,
      label,
      value: e.target.value
    });
  };

  return (
    <div className={classes}>
      <label className={labelClasses}>
        {label}
        <input
          type="radio"
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default RadioButton;
