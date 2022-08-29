import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { Context } from '../../Context/AuthContext';
import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

export const Dashboard = () => {
    const token = localStorage.getItem('token');

    const { authenticated, handleLogout } = useContext(Context);

    console.log(`Situação do usuário na página Dashboard: ${authenticated}`);

    return(
        <div>
            <NavBar />
            <h1>Dashboard</h1>
            {/* <h6>Token: {token}</h6> */}
        </div>
    )
}