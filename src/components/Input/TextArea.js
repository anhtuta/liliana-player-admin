import React, { PureComponent } from 'react';
import './Input.scss';

const DEFAULT_INPUT_MAX_LENGTH = 500;

class TextArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : '',
      length: props.value ? props.value.length : 0,
      errorMsg: ''
    };
  }

  onChange = (e) => {
    const { value } = e.target;
    const maxLength = this.props.maxLength
      ? this.props.maxLength
      : DEFAULT_INPUT_MAX_LENGTH;
    let errorMsg = '';

    if (value.length > maxLength) {
      errorMsg = 'Max length of input is: ' + maxLength;
    } else if (!this.regexValidation(value)) {
      errorMsg = this.props.regexErrorMsg ? this.props.regexErrorMsg : 'Input is invalid';
    }

    this.setState({
      value,
      errorMsg,
      length: value.length
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
      label,
      disabled = false,
      isRequire = false,
      placeholder,
      maxLength = DEFAULT_INPUT_MAX_LENGTH
    } = this.props;

    const { value, errorMsg, length } = this.state;

    return (
      <div className="input-wrapper">
        <label className="input-label">
          {label}
          {isRequire && <span className="input-require">&nbsp;*</span>}
        </label>
        <div className="input-textarea-wrapper">
          <textarea
            value={value}
            disabled={disabled}
            onChange={this.onChange}
            className={'input-text' + (!!errorMsg ? 'input-error' : '')}
            placeholder={placeholder}
            onKeyPress={this.onKeyPress}
          />
          <span className={'input-length' + (errorMsg ? ' text-red' : '')}>
            {length}/{maxLength}
          </span>
          {!!errorMsg && <div className="input-error-msg">{errorMsg}</div>}
        </div>
      </div>
    );
  }
}

export default TextArea;
