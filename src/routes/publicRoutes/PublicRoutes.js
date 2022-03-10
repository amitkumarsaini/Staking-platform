import React from "react";
import {Route, Switch} from "react-router-dom";
import Dashboard from "../../components/screens/public/dashboard/Dashboard";
import Swap from "../../components/screens/public/swap/Swap";
import Staking from "../../components/screens/public/staking/Staking";
import Liquidity from "../../components/screens/public/liquidity/Liquidity";
import Faq from "../../components/screens/public/faq/Faq";
import {rootName} from "../../constant";
import Inversestaking from "../../components/screens/public/Inversestaking/Inversestaking";
import Inlinestaking from "../../components/screens/public/Inlinestaking/Inlinestaking";
import Nftcoins from "../../components/screens/public/Nftcoins/Nftcoins";
import Userrank from "../../components/screens/public/Userrank/Userrank";
import Privacypolicy from "../../components/screens/public/Privacypolicy/Privacypolicy";
import Terms from "../../components/screens/public/Terms/Terms";

const PublicRoutes = () => {
  return (
    <Switch>
      <Route path={`${rootName}/`} component={Dashboard} exact={true} />
      <Route
        path={`${rootName}/dashboard`}
        component={Dashboard}
        exact={true}
      />
      <Route path={`${rootName}/swap`} component={Swap} exact={true} />

      <Route path={`${rootName}/staking`} component={Staking} exact={true} />
      <Route
        path={`${rootName}/liquidity`}
        component={Liquidity}
        exact={true}
      />
      <Route path={`${rootName}/faq`} component={Faq} exact={true} />
      <Route
        path={`${rootName}/Inversestaking`}
        component={Inversestaking}
        exact={true}
      />
      <Route
        path={`${rootName}/Inlinestaking`}
        component={Inlinestaking}
        exact={true}
      />
      <Route
        path={`${rootName}/coins/:coinType`}
        component={Nftcoins}
        exact={true}
      />
      <Route
        path={`${rootName}/userrank`}
        component={Userrank}
        exact={true}
      />
      <Route
        path={`${rootName}/Privacypolicy`}
        component={Privacypolicy}
        exact={true}
      />
      <Route
        path={`${rootName}/Terms`}
        component={Terms}
        exact={true}
      />
    </Switch>
  );
};

export default PublicRoutes;
