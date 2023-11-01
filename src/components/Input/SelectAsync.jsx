import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';

/**
 * defaultValue: là kiểu bất kỳ, String hoặc Integer hoặc JSON. Nếu là kiểu JSON,
 * nó nên có các field mà 2 method getOptionLabel và getOptionValue sẽ dùng (ở bên parent).
 * Field này thực chất là init value cho component
 *
 * props value cho component này sẽ cùng kiểu với props defaultValue.
 *
 * getOptionLabel sẽ bóc tách data từ value và hiển thị cho giá trị được chọn trên select.
 * Việc hiển thị này sẽ cho parent đảm nhiệm và tuỳ chỉnh
 *
 * getOptionValue sẽ bóc tách data từ value và gán value cho input bên trong select???
 * Không chắc đoạn này lắm, không rõ bên trong Select nó dùng giá trị được return từ
 * method getOptionValue này như thế nào.
 * Việc gán value này sẽ cho parent đảm nhiệm và tuỳ chỉnh
 */
const SelectAsync = (props) => {
  const {
    name,
    label,
    defaultValue = null,
    className = '',
    placeholder,
    getOptionLabel,
    getOptionValue,
    styles,
    innerRef = null,
    timeout = 500,
    isDisabled = false,
    isRequire = false,
    isMulti = false,
    isClearable = true
  } = props;
  const [value, setValue] = useState(defaultValue);

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
        ref={innerRef}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isClearable={isClearable}
      />
    </div>
  );
};

export default SelectAsync;
