import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
        <li>
            <ProfileButton user={sessionUser} />
        </li>
        );
    } else {
        sessionLinks = (
        <li>
            <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            />
        </li>
        );
    }

    return (
        <nav className="nav-bar-container">
            <a href='/'> Home </a>
            <ul className="nav-links">

                    {/* <NavLink exact to="/">
                    Home
                    </NavLink> */}

                <li>
                    {isLoaded && sessionLinks}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
