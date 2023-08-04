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
                <button className='createNewSpot'> Create a New Spot </button>
            </NavLink>
            <button className='navButton' onClick={openMenu}>
                <i className="fas fa-bars"/>
                <i className="fas fa-user-circle"/>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                <NavLink exact to="/spots/current">
                    Manage Spots
                </NavLink>

                </li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </div>
    );
}

export default ProfileButton;
