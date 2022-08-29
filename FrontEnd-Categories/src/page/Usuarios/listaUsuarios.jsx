import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './listaUsuarios.css'
import { confirmAlert } from 'react-confirm-alert';

import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

export const ListaUsuarios = () => {

    const [data, setData] = useState([]);

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (user) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Are you absolutely sure you want to delete section " +
            user.id +
            "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(user.id)
            },
            {
              label: "No",
              onClick: () => history.push("/usuarios")
            }
          ]
        });
      };

    const handleDelete = async (idUser) => {
        // console.log(idUser);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/user/"+idUser, headers)
        .then( (response) => {
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem
            })
            getUsers();
        }).catch( (err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: tente mais tarde...'
                })
            }
        })
    }

    const getUsers = async () => {

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/users/all", headers)
            .then( (response) => {
                setData(response.data.users)
                setStatus({loading: false})
            }).catch( (err) => {
                if(err.response){
                    setStatus({
                        type:'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type:'error',
                        mensagem: 'Erro: tente mais tarde...'
                    })
                }
            })
    }

    useEffect( () => {
        getUsers();
    }, [])

    return(
        <div>
            <NavBar />
        
            <h1 className="userCenter">Usuários</h1>

            <div className="buttonDiv">
                <Button className="buttonNew" variant="outline-success" href="/usuarios/novo">Novo Usuario</Button>{' '}
            </div>
<div className="table">
            <Table striped bordered hover>
                <tbody>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Email</th>
                </tr>
                {(!status.loading &&
                data.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className="spaceFlex">
                            <Button className="noLink" variant="outline-warning">
                                <Link className="onLink" to={"/usuarios/editar/"+user.id}>Editar</Link>
                            </Button>
                            <Button variant="outline-danger" onClick={() => confirmDelete(user)}>
                                Excluir
                            </Button>
                            </td>
                        </tr> 
                ))
                )}          
                </tbody>
      </Table>
      </div>
        </div>
    )
}