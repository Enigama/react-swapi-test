import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./pages/main";
import CharActer from "./pages/character";

export default () => {
  return (
    <Switch>
      <Route path="/" component={Main} exact />
      <Route path="/character/:slug" component={CharActer} exact />
    </Switch>
  );
};
