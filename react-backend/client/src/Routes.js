import React from "react";
import { Route, Switch } from "react-router-dom";
import  AppliedRoute  from './Components/AppliedRoute';
import { Intro } from './Pages';
import { AccessScreen } from './Pages';

const Routes = ({ childProps }) => {
  return(
    <Switch>
      <AppliedRoute path="/" exact component={Intro} props={ childProps }/>
      <AppliedRoute path="/login_register" exact component={ AccessScreen } props={ childProps }/>

      {/*<Route component={} />*/}
    </Switch>
  );
};
export { Routes };
