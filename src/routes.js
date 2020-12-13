import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./pages/main";
import CharActer from "./pages/character";

import {CHAR_ACTER_URL} from "./constant/ROUTE_NAMES";

export default () => {
  return (
    <Switch>
      <Route path="/" component={Main} exact />
      <Route path={`/${CHAR_ACTER_URL}/:slug`} component={CharActer} exact />
    </Switch>
  );
};
