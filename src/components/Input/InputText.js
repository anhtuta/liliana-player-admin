import React, { PureComponent } from 'react';
import './Input.scss';

const DEFAULT_INPUT_MAX_LENGTH = 200;

class InputText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue ? props.defaultValue : '',
      errorMsg: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultValue !== prevState.value) {
      return { value: nextProps.defaultValue };
    }
    return null;
  }

  onChange = (e) => {
    const { value } = e.target;
    const maxLength = this.props.maxLength ? this.props.maxLength : DEFAULT_INPUT_MAX_LENGTH;
    let errorMsg = '';

    if (value.length > maxLength) {
      errorMsg = 'Max length of input is: ' + maxLength;
    } else if (!this.regexValidation(value)) {
      errorMsg = this.props.regexErrorMsg ? this.props.regexErrorMsg : 'Input is invalid';
    }

    this.setState({
      value,
      errorMsg
    });

    this.props.onChange({
      name: this.props.name,
      value,
      invalid: !!errorMsg
    });
  };

  onKeyPress = (e) => {
    const { onKeyPress } = this.props;
    if (onKeyPress) {
      onKeyPress(e);
    }
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
      className = '',
      disabled = false,
      isRequire = false,
      type = 'text',
      maxLength = '',
      placeholder
    } = this.props;

    const { value, errorMsg } = this.state;

    return (
      <div className={`input-wrapper ${className}`}>
        {label && (
          <label className="input-label" htmlFor={`id-txt-${name}`}>
            {label}
            {isRequire && <span className="input-require">&nbsp;*</span>}
          </label>
        )}
        <div className="input-text-wrapper">
          <input
            id={`id-txt-${name}`}
            type={type}
            name={name}
            value={value}
            disabled={disabled}
            onChange={this.onChange}
            className={'input-text' + (!!errorMsg ? ' input-error' : '')}
            placeholder={placeholder}
            onKeyPress={this.onKeyPress}
            maxLength={maxLength}
          />
          {!!errorMsg && <div className="input-error-msg">{errorMsg}</div>}
        </div>
      </div>
    );
  }
}

export default InputText;
