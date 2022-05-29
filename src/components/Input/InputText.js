import React, { PureComponent } from 'react';
import './Input.scss';

const DEFAULT_INPUT_MAX_LENGTH = 200;

/**
 * InputText có 2 cơ chế setValue:
 * 1. Dùng state bên trong nó, khi user nhập thì value sẽ được thay đổi qua hàm onChange
 * 2. defaultValue được pass từ parent. Nếu defaultValue thay đổi thì value của
 *    nó cũng sẽ thay đổi theo dựa vào method getDerivedStateFromProps
 * Note: thực sự ko nên có getDerivedStateFromProps, vì như vậy logic code sẽ phức tạp.
 * Sau đây là 1 case dùng getDerivedStateFromProps:
 * Method onReset sẽ ko change state value, mà gọi method onReset của parent, parent sau đó
 * change state 'abcde' của nó, sau đó lại rerender lại và lại truyền 'abcde' đó
 * cho component này, nhờ có getDerivedStateFromProps nên value của nó sẽ được set lại
 */
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

  onClear = () => {
    this.setState({
      value: '',
      errorMsg: ''
    });
    this.props.onClear({
      name: this.props.name,
      value: '',
      invalid: false
    });
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
      isReset = false, // reset value of input to a value that specified by parent
      isClear = false, // clear value: set = empty
      titleReset = '',
      titleClear = '',
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
            title={disabled ? value : ''}
            disabled={disabled}
            onChange={this.onChange}
            className={'input-text' + (!!errorMsg ? ' input-error' : '')}
            placeholder={placeholder}
            onKeyPress={this.onKeyPress}
            maxLength={maxLength}
          />
          {isReset && (
            <i
              className="fa fa-refresh icon-btn-action icon-btn-edit"
              onClick={this.props.onReset}
              title={titleReset ? titleReset : 'Reset'}
            ></i>
          )}
          {isClear && (
            <i
              className="fa fa-trash icon-btn-action icon-btn-edit"
              onClick={this.onClear}
              title={titleClear ? titleClear : 'Clear'}
            ></i>
          )}
        </div>
        {!!errorMsg && <div className="input-error-msg">{errorMsg}</div>}
      </div>
    );
  }
}

export default InputText;
