import React from "react";
import { render } from "react-dom";

import CustomerSDK from './CustomerSDK';

try {
    console.log({ CustomerSDK })
} catch (error) {
    console.error(error);
}

render(<h1>Hello Worlddddd</h1>, document.getElementById("root"));