import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
// import "/image/Airbnb_logo_PNG3.png"
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
        <div>
            <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            />
        </div>
        );
    }

    return (
            <nav className="nav-bar-container">
                    <NavLink className="home" exact to="/">
                        <img className="AirBnbLogo"
                    src="../image/Airbnb_logo_PNG3.png" alt="AirBeeNBee"
                        />
                    </NavLink>
                <div className='nav-links'>
                    {isLoaded && sessionLinks}
                </div>
            </nav>
    );
}

export default Navigation;
