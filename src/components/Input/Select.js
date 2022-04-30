import React from 'react';
import ReactSelect from 'react-select';

const Select = (props) => {
  const {
    name,
    label,
    className = '',
    placeholder,
    options,
    defaultValue,
    isDisabled = false,
    isRequire = false,
    isMulti = false,
    isClearable = false,
    allowSelectAll = false
  } = props;

  const ALL_OPTION = {
    label: 'ALL',
    value: '*'
  };

  const onChange = (selected) => {
    if (isMulti) {
      props.onChange({
        name,
        selected
      });
    } else {
      props.onChange({
        name,
        label: selected.label,
        value: selected.value
      });
    }
  };

  return (
    <div className={`input-wrapper select-wrapper ${className}`}>
      <label className="input-label">
        {label}
        {isRequire && <span className="input-require">&nbsp;*</span>}
      </label>
      <ReactSelect
        name={name}
        placeholder={placeholder}
        options={allowSelectAll ? [ALL_OPTION, ...options] : options}
        defaultValue={defaultValue}
        onChange={onChange}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isClearable={isClearable}
      />
    </div>
  );
};

/*
Using example:
const storeOptions = [
  {value: 1, label: "Tiki"},
  {value: 2, label: "Lazada"},
  {value: 3, label: "Shopee", disabled: true}
]
const defaultOption = {
  {value: 2, label: "Lazada"}
}
<Select
  name="store"
  label="Working at"
  defaultOption={defaultOption}
  options={storeOptions}
  isRequire={true}
  onChange={this.handleOnChangeStore}
/>
*/
export default Select;
