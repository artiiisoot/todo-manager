import React from "react";
import ReactDOM from "react-dom/client";
// import "./assets/css/index.scss";
import "./assets/css/index.scss";
import "react-loading-skeleton/dist/skeleton.css"; 
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./firebase";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { AuthProvider } from "./provider/AuthProvider";
import { DataProvider } from "./provider/DataProvider";
import { max } from "moment";

function style() {
  
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Provider store={store}>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </Provider>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
