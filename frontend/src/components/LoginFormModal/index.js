import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal (){
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if(data && data.errors) setErrors(data.errors);
            }
        );
    };

    const handledemoUser = (e) => {
        e.preventDefault()
        return dispatch(sessionActions.login({ credential:'DemoUser', password: 'password'}))
        .then(closeModal)
    }


    const disabledLogIn = credential.length < 4 || password.length < 6

    return (
    <div className="log-in-form-container">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
            <input
                className="user-input"
                type="text"
                value={credential}
                placeholder=" Username or Email"
                onChange={(e) => setCredential(e.target.value)}
                required
                />
            <input
                className="user-input"
                type="password"
                value={password}
                placeholder=" Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                {errors && <div className="log-in-errors">{errors.message}</div>}
            <button disabled={disabledLogIn} className="log-in-button" type="submit">Log In</button>
            <button onClick={handledemoUser} className='demo-button'>Log in as Demo User</button>
        </form>
    </div>
    );
}

export default LoginFormModal;
