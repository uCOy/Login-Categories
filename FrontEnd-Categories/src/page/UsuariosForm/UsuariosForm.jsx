import React, { useState, useContext, useEffect } from "react";
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../components/Login/styles.css';
import { Context } from '../../Context/AuthContext';
import { Nav, Navbar } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'


const initialValue = {
    name: '',
    email: '',
    password: ''
}

export const UsuariosForm = (props) => {

    const history = useHistory();

    const [id] = useState(props.match.params.id);
    
    const [values, setValues] = useState(initialValue);
    const [acao, setAcao] = useState('Novo');
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })

    const { authenticated, handleLogout } = useContext(Context);


    const valorInput = e => setValues({
        ... values,
        [e.target.name]: e.target.value
    })

    useEffect( () => {

      const getUser = async () => {

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/users/show/"+id, headers)
            .then( (response) => {
                if(response.data.users){
                  setValues(response.data.users);
                  setAcao('Editar')
                } else {
                  setStatus({
                    type: 'warning',
                    mensagem:'Usuário não encontrado!!!'
                  })
                } 
                // setData(response.data.users)
            }).catch( (err) => {
                if(err.response){
                    setStatus({
                        type:'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type:'error',
                        mensagem: 'Erro: tente mais tarde.....!'
                    })
                }
            })
    }
    
    if(id) getUser();
    }, [id])

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const valueToken = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'headers': {'Authorization': 'Bearer ' + valueToken}
        }

        if(!id){

          await api.post("/users/create", values, headers)
              .then( (response) => {
                      console.log(response);
                      setStatus({loading: false});
                      return history.push('/usuarios')
                  }).catch( (err) => {
                      if(err.response){
                          setStatus({
                              type: 'error',
                              mensagem: err.response.data.mensagem,
                              loading: false
                          })
                      } else {
                          setStatus({
                              type: 'error',
                              mensagem: 'Erro: tente mais tarde...',
                              loading: false
                          })                
                      }  
                  })
        } else {
          await api.put("/users/update", values, headers)
              .then( (response) => {
                      console.log(response);
                      setStatus({loading: false});
                      return history.push('/usuarios')
                  }).catch( (err) => {
                      if(err.response){
                          setStatus({
                              type: 'error',
                              mensagem: err.response.data.mensagem,
                              loading: false
                          })
                      } else {
                          setStatus({
                              type: 'error',
                              mensagem: 'Erro: tente mais tarde...',
                              loading: false
                          })                
                      }  
                  })
        }
    }

    return(
        <div>    
            <NavBar />
            <Container className="box">
              <h1>{acao} Usuário</h1>
              <Form onSubmit={formSubmit} className="borderForm">
                {/* {status.type == 'error' ? <p>{status.mensagem}</p>: ""} */}
                {/* {status.type == 'success' ? <p>{status.mensagem}</p>: ""} */}

                {['success',].map((variant) => (
                  <p>
                    {status.type == 'success' ? 
                    <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
                  </p>
                ))}
          
                {['danger',].map((variant) => (
                  <p>
                    {status.type == 'error' ? 
                    <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
                  </p>
                ))}
          
                {['warning'].map((variant) => (
                  <p>
                    {status.loading ?
                  <Alert key={variant} variant={variant}> Enviando... </Alert> : ""}
                  </p>
                ))}
                
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={values.name} onChange={valorInput} placeholder="Enter Name" />
                </Form.Group>  

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" value={values.email} onChange={valorInput} placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    {/* Nunca compartilharemos seu e-mail com mais ninguém */}
                  </Form.Text>
                </Form.Group>
                {!id &&
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={values.password} onChange={valorInput} placeholder="Password" />
                </Form.Group>
                }
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                {status.loading ? <Button id="button" variant="primary" disabled type="submit" >Enviando...</Button>
                : <Button id="button" variant="primary" type="submit" >Enviar</Button>}
              </Form>
          </Container>
        </div>
    )
}