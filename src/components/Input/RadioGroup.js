import React, { useState } from 'react';
import RadioButton from './RadioButton';
import './RadioButton.scss';

const RadioGroup = (props) => {
  const {
    name,
    label,
    options = [],
    defaultOption,
    className = '',
    labelClassName = '',
    isRequire = false
  } = props;

  const [option, setOption] = useState(defaultOption);

  const onChange = (selected) => {
    const newOption = {
      label: selected.label,
      value: selected.value
    };
    setOption(newOption);
    props.onChange({
      name,
      ...newOption
    });
  };

  return (
    <div className="radio-group-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {isRequire && <span className="input-require">&nbsp;*</span>}
        </label>
      )}
      {options.length > 0 &&
        options.map((op, index) => {
          return (
            <RadioButton
              key={index}
              label={op.label}
              name={name}
              value={op.value}
              onChange={onChange}
              className={className}
              labelClassName={labelClassName}
              checked={option && op.value === option.value ? true : false}
              disabled={op.disabled}
            />
          );
        })}
    </div>
  );
};

/*
Using example:
const genderOptions = [
  {
    label: 'Male',
    value: 'male'
  },
  {
    label: 'Female',
    value: 'female'
  },
  {
    label: 'Gay',
    value: 'gay'
  },
  {
    label: 'Lesbian',
    value: 'lesbian',
    disabled: true
  },
  {
    label: 'Unknown',
    value: 'unknown'
  }
];
const defaultOption = {
  label: 'Female',
  value: 'female'
}
<RadioGroup
  name="gender"
  label="Gender"
  defaultOption={defaultOption}
  options={genderOptions}
  onChange={this.onChangeGender}
/>
*/
export default RadioGroup;
