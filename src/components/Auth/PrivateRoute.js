import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from './Auth';

/**
 * Route này phải login xong mới vào được
 *
 * Ref: https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5
 */
const PrivateRoute = ({ children, userInfo }) => {
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /login page
  // TODO send currentPath to Login component, after user logins successfully,
  // redirect to that path instead of home
  const currentPath = useLocation().pathname;
  // console.log('currentPath', currentPath);

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" />;
  } else if (userInfo && !auth.rolesHasPermission(userInfo.roleArray, currentPath)) {
    // Đã login nhưng ko có quyền vào trang này
    return (
      <div>
        <h2>Oops! Access denied!</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default PrivateRoute;

/*
Sử dụng: dùng route này bên trong Route của react router, ex:
<Route
  path="/song"
  element={
    <PrivateRoute userInfo={userInfo}>
      <Song />
    </PrivateRoute>
  }
/>
*/
