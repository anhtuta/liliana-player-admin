import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './Auth';

/**
 * Nếu đã login rồi thì Route này sẽ return về home page.
 *
 * Ví dụ page dùng route này: Login page. Hiển nhiên khi user đã login rồi mà lại cố tình
 * vào lại trang login thì phải redirect họ về home page
 *
 * Ref: https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
 */
const RestrictedRoute = ({ children }) => {
  return !auth.isAuthenticated() ? <>{children}</> : <Navigate to="/" />;
};

export default RestrictedRoute;

/*
Sử dụng: dùng route này bên trong Route của react router, ex:
<Route
  path="/login"
  element={
    <RestrictedRoute>
      <Login />
    </RestrictedRoute>
  }
/>
*/
