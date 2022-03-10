import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
// import {} from '../../components/screens/privateScreen/';
import NoPageFound from "../../components/screens/nopagfound/NoPageFound";
import { rootName } from "../../constant";
import Login from "../../components/screens/admin/login/Login";
import PrivateRoute from "../../components/screens/admin/PrivateRoute";
import AdminIndex from "../../components/screens/admin/dashboard/AdminIndex";

import ManageTimeIndividual from "../../components/screens/admin/manageTimeIndividual/ManageTimeIndividual";
import ManageTimeIndex from "../../components/screens/admin/manageTimeIndex/ManageTimeIndex";

import ManageFixedIndividualPlan from "../../components/screens/admin/manageFixedIndividualPlan/ManageFixedIndividualPlan";
import ManageFixedIndexPlan from "../../components/screens/admin/manageFixedIndexPlan/ManageFixedIndexPlan";
import ManageFlexibleIndividualPlan from "../../components/screens/admin/manageFlexibleIndividualPlan/ManageFlexibleIndividualPlan";
import ManageFlexibleIndexPlan from "../../components/screens/admin/manageFlexibleIndexPlan/ManageFlexibleIndexPlan";

import ManagePenalty from "../../components/screens/admin/managePenalty/ManagePenalty";
import ManageSettings from "../../components/screens/admin//manageSettings/ManageSettings";
import AdminSidebar from "../../components/screens/admin/adminSidebar/AdminSidebar";
import Loading from "../../components/screens/admin/Loader/Loading";

const PrivateRoutes = () => {
  return (
    <Switch>
      <>
        <AdminSidebar />
        <Loading />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard`}
          component={AdminIndex}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/:coin/:plan/:type`}
          component={AdminIndex}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/:coin/:index`}
          component={AdminIndex}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-time-individual`}
          component={ManageTimeIndividual}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-time-index`}
          component={ManageTimeIndex}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-fixed-individual-plan`}
          component={ManageFixedIndividualPlan}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-fixed-index-plan`}
          component={ManageFixedIndexPlan}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-flexible-individual-plan`}
          component={ManageFlexibleIndividualPlan}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-flexible-index-plan`}
          component={ManageFlexibleIndexPlan}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-settings`}
          component={ManageSettings}
        />
        <PrivateRoute
          exact
          path={`${rootName}/admin/dashboard/manage-penalty`}
          component={ManagePenalty}
        />
      </>
    </Switch>
  );
};

export default PrivateRoutes;
