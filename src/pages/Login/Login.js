import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '../../components/Button/Button';
import InputText from '../../components/Input/InputText';
import { auth } from '../../components/Auth/Auth';
import Toast from '../../components/Toast/Toast';
import './Login.scss';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      redirectToRefer: false
    };
    this.from = { pathname: '/' };
  }

  onChange = (obj) => {
    this.setState({
      [obj.name]: obj.value
    });
  };

  handleSubmit = () => {
    const { username, password } = this.state;
    const data = {
      username,
      password
    };
    auth.login(
      data,
      () => {
        if (this.props.location.state) {
          this.from = this.props.location.state.from;
        }
        window.location.hash = this.from.pathname;

        // reload to rerender Nav (some menu could be displayed only after login)
        window.location.reload();
      },
      (err) => {
        Toast.error(err);
      }
    );
  };

  render() {
    const { username, password, redirectToRefer } = this.state;

    if (redirectToRefer) {
      return <Redirect to={this.from} />;
    }

    return (
      <div className="login-wrapper">
        <h2 className="login-header">Login</h2>
        <InputText
          label="Username"
          name="username"
          value={username}
          onChange={this.onChange}
        />
        <InputText
          label="Password"
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
        />
        <Button text="Login" onClick={this.handleSubmit} />
      </div>
    );
  }
}

export default Login;
