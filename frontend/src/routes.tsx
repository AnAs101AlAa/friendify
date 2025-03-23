import SignupPage from "./pages/authPages/signupPage";
import React from "react";
import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/authPages/loginPage";
import MainPage from "./pages/mainPage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: React.createElement(SignupPage)
    },
    {
        path: "/login",
        element: React.createElement(LoginPage)
    },
    {
        path: "/main",
        element: React.createElement(MainPage)
    }
]

export default routes;