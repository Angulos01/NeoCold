import React, { useState } from 'react';
import httpClient from '../httpClient';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        console.log(username, password);

        try {
            await httpClient.post("//localhost:5000/login", {
                username,
                password
            });

            window.location.href = "/";
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials");
            }
        }
    };

    return (
        <section className='cubo'>
            <br />
            <h3>Log in into account</h3>
                <section className="options">
                    <br />
                    <span>
                        <a href="/register">Create account</a>
                    </span>
                </section>
            <form action="">
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        id=""
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id=""
                    />
                </div>
                <button type="button" onClick={() => logInUser()}>
                    Submit
                </button>
            </form>
            <br />
        </section>
    );
};

export default LoginPage;
