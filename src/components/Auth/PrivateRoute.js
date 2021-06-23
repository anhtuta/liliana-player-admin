import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from './Auth';

const PrivateRoute = ({ component: Component, userInfo, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props) => {
        if (!auth.isAuthenticated()) {
          return (
            // Chưa login, redirect về trang login
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        } else if (
          userInfo &&
          !auth.rolesHasPermission(userInfo.roleArray, props.location.pathname)
        ) {
          // Đã login nhưng ko có quyền vào trang này
          return (
            <div>
              <h2>Oops! Access denied!</h2>
              <p>You don't have permission to access this page.</p>
            </div>
          );
        } else {
          return <Component {...props} userInfo={userInfo} />;
        }
      }}
    />
  );
};

export default PrivateRoute;

/*
<Component {...props} userInfo={userInfo} />
Hiện tại chưa thấy dùng props
*/
