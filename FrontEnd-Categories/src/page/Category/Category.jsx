import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './category.css'
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';
import { NavBar } from '../../components/UI/NavBar/NavBar'


import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaCategories = () => {

    const history = useHistory();

    const [data, setData] = useState([]);

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (categories) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Are you absolutely sure you want to delete section " +
            categories.id +
            "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(categories.id)
            },
            {
              label: "No",
              onClick: () => history.push("/categories")
            }
          ]
        });
      };

    const handleDelete = async (idCategories) => {
        console.log(idCategories);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/categories/delete/"+idCategories, headers)
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

    const getCategories = async () => {

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/categories/all", headers)
            .then( (response) => {
                setData(response.data.categories)
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
        getCategories();
    }, [])

    return(
        <div>
            <NavBar />
            
        
            <h1 className="userCenter">Categorias</h1>

            <div className="buttonDiv">
                <Button className="buttonNew" variant="outline-success" href="/categories/novo">Nova Categoria</Button>{' '}
            </div>
<div className="table">
            <Table striped bordered hover>
                <tbody>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Description</th>
                </tr>
                {(!status.loading &&
                data.map(categories => (
                        <tr key={categories.id}>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.description}</td>
                            <td className="spaceFlex">
                            <Button className="noLink" variant="outline-warning">
                                <Link className="onLink" to={"/categories/editar/"+categories.id}>Editar</Link>
                            </Button>
                            <Button variant="outline-danger" onClick={() => confirmDelete(categories)}>
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