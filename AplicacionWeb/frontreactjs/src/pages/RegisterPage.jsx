import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last, setLast] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [age, setAge] = useState("");
    const [occupation, setOccupation] = useState("");
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await httpClient.get("//localhost:5000/optioncompany"); // Cambia la URL a la ruta correcta de tu API
                setCompanies(response.data.listcompany);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies();
    }, []);

    const registerUser = async () => {
        try {
            await httpClient.post("//localhost:5000/register", {
                username,
                password,
                name,
                last,
                birthdate,
                age,
                occupation,
                company: selectedCompany // Agrega el valor seleccionado al objeto de registro
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
            <h3>Create an account</h3>
            <section className="options">
                    <br />
                    <span>
                        <a href="/login">Login</a>
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
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        id=""
                    />
                </div>
                <div>
                    <label>Last name: </label>
                    <input
                        type="text"
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        id=""
                    />
                </div>
                <div>
                    <label>Birthdate: </label>
                    <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        id=""
                    />
                </div>
                <br />
                <div>
                    <label>age: </label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        id=""
                    />
                </div>
                <br />
                <div>
                    <label>Ocuppation: </label>
                    <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        id=""
                    />
                </div>
                <div>
                    <label>Company: </label>
                    <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        id=""
                    >
                        <option value="">Select a company</option>
                        {companies.map((company, index) => (
                            <option key={index} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button" onClick={() => registerUser()}>
                    Submit
                </button>
            </form>
            <br />
        </section>
    );
};

export default RegisterPage;
