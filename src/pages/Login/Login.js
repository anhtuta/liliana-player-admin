import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import InputText from '../../components/Input/InputText';
import { auth } from '../../components/Auth/Auth';
import Toast from '../../components/Toast/Toast';
import './Login.scss';

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const onChange = (obj) => {
    console.log('obj', obj);
    setForm({
      ...form,
      [obj.name]: obj.value
    });
  };

  const handleSubmit = () => {
    const { username, password } = form;
    const data = {
      username,
      password
    };
    auth.login(
      data,
      () => {
        Toast.success('Login success! Welcome back!');
        // TODO redirect to previous protected page instead of home
        navigate('/');
        setTimeout(() => {
          navigate(0); // Reload page, so Nav can update userInfo
        }, 0);
      },
      (err) => {
        // Lỗi này API return status = 401, đã xử lý bên axios.interceptors rồi
        // Toast.error(err);
      }
    );
  };

  console.log('render');
  const { username, password } = form;

  return (
    <div className="login-wrapper">
      <h2 className="login-header">Login</h2>
      <InputText label="Username" name="username" value={username} onChange={onChange} />
      <InputText
        label="Password"
        name="password"
        value={password}
        onChange={onChange}
        type="password"
      />
      <Button text="Login" onClick={handleSubmit} />
    </div>
  );
}
