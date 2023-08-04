import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import "./Navigation.css";
import { NavLink } from "react-router-dom";


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

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
    };

    // const manageSpots = (e) => {
    //     e.preventDefault();
    //     dispatch()
    // }


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
            </div>
        </div>
    );
}

export default ProfileButton;
