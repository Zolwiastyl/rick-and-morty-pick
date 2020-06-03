import React from "react";
import { Route } from "react-router";

import { App } from "../App";
import { DesignLook } from "../pages/design";

export default (
	<Route>
		<Route path="./" component={App} />
		<Route path="./design" component={DesignLook} />
	</Route>
);
