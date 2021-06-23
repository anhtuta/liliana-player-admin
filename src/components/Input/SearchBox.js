import React, { PureComponent } from 'react';
import './Input.scss';

const DEFAULT_INPUT_MAX_LENGTH = 200;

class SearchBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      errorMsg: '',
      invalid: false,
      focus: false
    };
  }

  onChange = (e) => {
    const { value } = e.target;
    const maxLength = this.props.maxLength
      ? this.props.maxLength
      : DEFAULT_INPUT_MAX_LENGTH;
    let errorMsg = '';

    if (value.length > maxLength) {
      errorMsg = 'Max length of search text is: ' + maxLength;
    } else if (!this.regexValidation(value)) {
      errorMsg = this.props.regexErrorMsg
        ? this.props.regexErrorMsg
        : 'Search text is invalid';
    }

    this.setState({
      value,
      errorMsg
    });
  };

  onKeyUp = (e, searchText) => {
    if (e.keyCode === 13) {
      // Enter
      this.onSearch(searchText);
    }
  };

  onSearch = () => {
    let { value } = this.state;
    this.props.onSearch({ name: this.props.name, value });
  };

  onClear = () => {
    this.setState({
      value: ''
    });
    this.props.onSearch({ name: this.props.name, value: null });
  };

  regexValidation = (value) => {
    const regex = this.props.regex ? this.props.regex : '';
    if (value === '' || regex === '') return true;
    return value.match(regex);
  };

  render() {
    const {
      name,
      label,
      disabled = false,
      isRequire = false,
      type = 'text',
      placeholder = 'Search...'
    } = this.props;

    const { value, errorMsg } = this.state;

    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label">
            {label}
            {isRequire && <span className="input-require">&nbsp;*</span>}
          </label>
        )}
        <div className="input-search-wrapper">
          <i className="fas fa-search input-icon-search" onClick={this.onSearch}></i>
          <input
            type={type}
            name={name}
            value={value}
            disabled={disabled}
            onChange={this.onChange}
            className={
              'input-text input-text-seach ' + (!!errorMsg ? ' input-error' : '')
            }
            placeholder={placeholder}
            onKeyUp={this.onKeyUp}
          />
          {value && (
            <i className="fas fa-times input-icon-clear" onClick={this.onClear}></i>
          )}
          {!!errorMsg && <div className="input-error-msg">{errorMsg}</div>}
        </div>
      </div>
    );
  }
}

export default SearchBox;
