import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PublicRoutes from "./routes/publicRoutes/PublicRoutes";
import PrivateRoutes from "./routes/privateRoutes/PrivateRoutes";
import { rootName } from "./constant";
import Login from "./components/screens/admin/login/Login";
import LoaderComponent from "./components/common/LoaderCompoent/LoaderCompoent";
import { getTokenDecimals } from "./redux/actions/ethereum.action";
import { XIV, XIV_BNB } from "./constant";
import { useSelector, useDispatch } from "react-redux";
import { connectmetamask, disconnectWallet } from "./redux/actions/user.action";
import { betFixed, callContractMethod } from "./redux/actions/ethereum.action";
import {
  FLEXIbLE_PLANS,
  FIXED_PLAN,
  BET_DAYS_FLEXIbLE,
  BET_DAYS_FIXED,
} from "./redux/constant/actionTypes";

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function Application() {
  const platform = useSelector((state) => state.user.platform);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const theme = useSelector((state) => state.user.theme);
  let [flexiblePlans, setFlexiblePlans] = useState([]);
  let [betDaysFlexible, setBetDaysFlexible] = useState([]);
  let [betDaysFixed, setBetDaysFixed] = useState([]);
  let [userTheme, setUserTheme] = useState();
  const dispatch = useDispatch();
  localStorage.setItem("network", 'bnb');
  useEffect(async () => {



    getPlansDetails();
    let network = await localStorage.getItem("network");
    let data = {
      tokenAddress: network === "bnb" ? XIV_BNB : XIV
    };
    dispatch(getTokenDecimals(data));
  }, []);
  useEffect(async () => {
    if (platform === 1) {
      document.body.className = document.body.className.replace(
        "greenactive",
        ""
      );
      document.body.className += " redactive";
    } else {
      document.body.className += " greenactive";
      document.body.className = document.body.className.replace(
        "redactive",
        ""
      );
    }
  }, [platform]);
  useEffect(async () => {
    if (walletAddress) {
      dispatch(connectmetamask());
    }
  }, [walletAddress]);

  useEffect(async () => {
    setUserTheme(createTheme({
      palette: {
        type: theme ? theme : 'dark',
      }
    }))
  }, [theme])

  useEffect(async () => {
    dispatch({ type: FLEXIbLE_PLANS, payload: flexiblePlans });
    dispatch({ type: BET_DAYS_FLEXIbLE, payload: betDaysFlexible });
  }, [flexiblePlans, betDaysFlexible]);

  const getPlansDetails = async () => {
    dispatch(callContractMethod("planCounter", [], false)).then(
      async (counter) => {
        if (counter && parseInt(counter) > 0) {
          setFlexiblePlans([]);
          for (var i = 0; i < counter; i++) {
            let plan = await dispatch(callContractMethod("plans", [i], false));
            if (i === 0) {
              if (plan.isActive) {
                dispatch({ type: FIXED_PLAN, payload: plan });
              }
            } else {
              if (plan.isActive) {
                setFlexiblePlans((flexiblePlans) => [...flexiblePlans, plan]);
              }
            }
          }
        }
      }
    );

    dispatch(callContractMethod("planDaysCounter", [], false)).then(
      async (counter) => {
        if (counter && parseInt(counter) > 0) {
          setBetDaysFixed([]);
          setBetDaysFlexible([]);
          for (var i = 0; i < counter; i++) {
            let day = await dispatch(
              callContractMethod("planDaysIndexed", [i], false)
            );
            if (i === 0) {
              if (parseInt(day) > 0) {
                dispatch({ type: BET_DAYS_FIXED, payload: [day] });
              }
            } else {
              if (parseInt(day) > 0) {
                setBetDaysFlexible((betDaysFlexible) => [
                  ...betDaysFlexible,
                  day,
                ]);
              }
            }
          }
        }
      }
    );
  };

  return (
    <ThemeProvider theme={userTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router>
          <LoaderComponent></LoaderComponent>
          <Switch>
            <Route exact path={`${rootName}/admin`} component={Login} />
            {/* <Route path={`${rootName}/admin/dashboard`} component={PrivateRoutes} /> */}
            {/* <PublicRoute path={`${rootName}/admin`} component={Login} /> */}
            <Route path={`${rootName}/admin/dashboard`} component={PrivateRoutes} />
            <Route path={`${rootName}/`} component={PublicRoutes} />
          </Switch>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
export default Application;
