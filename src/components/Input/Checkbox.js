import React, { useState } from 'react';
import './Checkbox.scss';

/**
 * Ref: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_custom_checkbox
 */
const Checkbox = (props) => {
  const {
    label,
    headerLabel,
    name,
    className = '',
    defaultChecked = false,
    isRequire = false,
    disabled = false
  } = props;
  const classes = `custom-cb-wrapper ${className}`;
  const [checked, setChecked] = useState(defaultChecked);

  const onChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    // gọi hàm onChange của component cha, param giống như component InputText
    props.onChange({
      name,
      value: newChecked
    });
  };

  return (
    <div className={classes}>
      {headerLabel && (
        <label className="input-label">
          {headerLabel}
          {isRequire && <span className="input-require">&nbsp;*</span>}
        </label>
      )}
      <label className="custom-cb-container">
        {label}
        <input
          type="checkbox"
          name={name}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

/**
 * Note: HTML thì ko cần onChange, nếu click vào checkbox thì nó tự thay đổi
 * (chuyển từ chưa check sang check và ngược lại). Nhưng với React thì ko có
 * thì lúc click sẽ ko thay đổi gì!
 * Note2: class cha dùng component này phải truyền props checked = true/false,
 * nếu ko sẽ ko hoạt động!
 */
export default Checkbox;
