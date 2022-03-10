import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { rootName } from "../../../constant";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const logged = useSelector((state) => state.admin_user.isLoggedIn);

  return (
    <Route
      {...rest}
      render={(props) =>
        logged === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: `${rootName}/admin`,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
