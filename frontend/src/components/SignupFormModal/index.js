// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
const dispatch = useDispatch();
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [errors, setErrors] = useState({});
const { closeModal } = useModal();

const disabledSignUp =
    username.length < 4 ||
    password.length < 6 ||
    confirmPassword.length < 6 ||
    email.length < 1 ||
    firstName.length < 1 ||
    lastName.length < 1

const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
    setErrors({});
    return dispatch(
        sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
        })
    )
        .then(closeModal)
        .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            setErrors(data.errors);
        }
    });
}
    return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
    });
};


return (
    <div className="sign-up-form-container">

    <h2>Sign Up</h2>
    <form onSubmit={handleSubmit}>
        <input
            className="user-info"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
        {errors.firstName && <p>{errors.firstName}</p>}

        <input
            className="user-info"
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            />
        {errors.lastName && <p>{errors.lastName}</p>}

        <input
            className="user-info"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        {errors.email && <p>{errors.email}</p>}

        <input
            className="user-info"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        {errors.username && <p>{errors.username}</p>}


        <input
            className="user-info"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        {errors.password && <p>{errors.password}</p>}

        <input
            className="user-info"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        {errors.confirmPassword && (<p>{errors.confirmPassword}</p>)}

        <button disabled={disabledSignUp} className="sign-up-button"type="submit">Sign Up</button>
    </form>
</div>

);
}

export default SignupFormModal;
