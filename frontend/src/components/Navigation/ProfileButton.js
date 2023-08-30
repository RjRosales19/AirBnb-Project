import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import "./Navigation.css";
import { NavLink, useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const ulRef = useRef();
    const [showMenu, setShowMenu] = useState(false);
    const history = useHistory();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
    };



const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div>
            <NavLink exact to="/spots/new">
                <button className='create-new-spot-button'> Create a New Spot </button>
            </NavLink>
            <button className='navButton' onClick={openMenu}>
                <i className="fas fa-bars"/>
                <i className="fas fa-user-circle"/>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div className="nav-info">
                            <div>Hello, {user.firstName}</div>
                            <div>{user.email}</div>
                            <div>
                            <NavLink className="manage-spots-link"exact to="/spots/current">
                                Manage Spots
                            </NavLink>
                            </div>
                            <button className="log-out-button"onClick={logout}>Log Out</button>
                        </div>
                    </>
                ) : (
                    <>
                    <button className='navButton' onClick={openMenu}>
                    <li>
                        <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                        />
                    </li>
                    <li>  <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                    /></li>
                    </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
