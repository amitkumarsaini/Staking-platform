import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthGuard = ({ component: Component, ...rest }) => {
  // const { token } = rest;
  const isAuthenticated = true;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

// const mapStateToProps = state => {
//   return {
//     token: true
//   };
// };

export default AuthGuard;
