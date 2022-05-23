import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';

const SelectAsync = (props) => {
  const {
    name,
    label,
    className = '',
    placeholder,
    getOptionLabel,
    getOptionValue,
    styles,
    timeout = 500,
    isDisabled = false,
    isRequire = false,
    isMulti = false,
    isClearable = true
  } = props;
  const [value, setValue] = useState(null);

  const onChange = (selected) => {
    props.onChange({
      name,
      selected
    });
    setValue(selected);
  };

  // method này sẽ fetch data từ API, data đó là mảng options dùng cho Select,
  // value của Select chính là 1 phần tử của mảng options, việc setValue được thực hiện
  // ở method onChange
  const loadOptions = async (searchText) => {
    return props.loadOptions(searchText);
  };

  return (
    <div className={`input-wrapper select-wrapper ${className}`}>
      <label className="input-label">
        {label}
        {isRequire && <span className="input-require">&nbsp;*</span>}
      </label>
      <AsyncSelect
        name={name}
        placeholder={placeholder}
        cacheOptions
        defaultOptions
        value={value}
        // param của getOptionLabel và getOptionValue chính là state value ở trên
        getOptionLabel={getOptionLabel} // hiển thị trên Select sau khi chọn
        getOptionValue={getOptionValue} // chắc dùng cho onChange cho thẻ input bên trong AsyncSelect
        // ref: https://stackoverflow.com/a/53960337/7688028
        loadOptions={debounce(loadOptions.bind(this), timeout)}
        onChange={onChange}
        styles={styles}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isClearable={isClearable}
      />
    </div>
  );
};

export default SelectAsync;
