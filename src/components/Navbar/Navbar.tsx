"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Button from "../UI/Button/Button";
import Input from '../UI/Input/Input';
import Modal from "../Modal/Modal";
import Form from "../Form/Form";

const StyledNav = styled.nav`
    background-color: var(--primary-color);
    position: sticky;
    top: 0;
    display: flex;
    justify-content: flex-end;
`;

const StyledButton = styled(Button)`
    margin: 0.8rem;
    width: 8rem;
    padding: 0.6rem;
    color: var(--tertiary-color);
    background-color: var(--primary-color);
`;

const StyledContainerButton = styled.div`
    text-align: center;
`;

const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [modalLoginVisible, setModalLoginVisible] = useState(false);
    const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
    const [selectedEmailLogin, setSelectedEmailLogin] = useState('');
    const [selectedPasswordLogin, setSelectedPasswordLogin] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedPasswordRegister, setSelectedPasswordRegister] = useState('');
    const [selectedEmailRegister, setSelectedEmailRegister] = useState('');

    // Función para mostrar/ocultar modal de login
    const toggleModalLogin = () => {
        setModalLoginVisible(!modalLoginVisible);
    };

    // Función para mostrar/ocultar modal de registro
    const toggleModalRegister = () => {
        setModalRegisterVisible(!modalRegisterVisible);
    };

    // Manejar los cambios en el input del login
    const handleChangeEmailLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmailLogin(event.target.value);
    };

    const handleChangePasswordLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPasswordLogin(event.target.value);
    };

    // Manejar los cambios en el input del registro
    const handleChangeEmailRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmailRegister(event.target.value);
    };

    const handleChangePasswordRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPasswordRegister(event.target.value);
    };

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName(event.target.value);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    //Envío del formulario de registro
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!selectedName || !selectedEmailRegister || !selectedPasswordRegister) {
            alert("Por favor, completa todos los campos");
            return;
        }

        const response: Response = await fetch('https://simuate-test-backend-1.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: selectedName,
                email: selectedEmailRegister,
                password: selectedPasswordRegister,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Usuario registrado exitosamente :)");
            setModalRegisterVisible(false);
            setSelectedName('');
            setSelectedEmailRegister('');
            setSelectedPasswordRegister('');
        } else {
            console.log("Error en el registro:", result.message);
            alert(`Error en el registro: ${result.message}`);
        }
    };


    // Envío del formulario de login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Método signIn para autenticar el usuario
        const result = await signIn("credentials", {
            redirect: false,
            email: selectedEmailLogin,
            password: selectedPasswordLogin
        });

        if (result?.error) {
            console.log("Error de autenticación:", result.error);
            alert(`Credenciales incorrectas`)
        } else {
            console.log("Inicio de sesión exitoso");
            router.push("/posts");
            setModalLoginVisible(false);
            setSelectedEmailLogin('');
            setSelectedPasswordLogin('');
        }
    };


    return (
        <>
            <StyledNav>
                {status === "authenticated" ? (
                    <StyledButton type="button" onClick={handleLogout}>
                        Cerrar sesión
                    </StyledButton>
                ) : (
                    <>
                        <StyledButton type="button" onClick={toggleModalLogin}>
                            Iniciar sesión
                        </StyledButton>
                        <StyledButton type="button" onClick={toggleModalRegister}>
                            Registrarse
                        </StyledButton>
                    </>
                )}
            </StyledNav>

            {/* Modal de inicio de sesión */}
            {!session && (
                <Modal isVisible={modalLoginVisible} onClose={toggleModalLogin}>
                    <Form onSubmit={handleLoginSubmit}>
                        <h1>Iniciar sesión</h1>
                        <Input
                            type="email"
                            name="email"
                            value={selectedEmailLogin}
                            onChange={handleChangeEmailLogin}
                            placeholder="Correo electrónico"
                        />
                        <Input
                            type="password"
                            name="password"
                            value={selectedPasswordLogin}
                            onChange={handleChangePasswordLogin}
                            placeholder="Contraseña"
                        />
                        <StyledContainerButton>
                            <StyledButton type="submit">Enviar</StyledButton>
                        </StyledContainerButton>
                    </Form>
                </Modal>
            )}

            {/* Modal de registro */}
            {!session && (
                <Modal isVisible={modalRegisterVisible} onClose={toggleModalRegister}>
                    <Form onSubmit={handleRegisterSubmit}>
                        <h1>Regístrate</h1>
                        <Input
                            type="text"
                            name="name"
                            value={selectedName}
                            onChange={handleChangeName}
                            placeholder="Nombre"
                        />
                        <Input
                            type="email"
                            name="email"
                            value={selectedEmailRegister}
                            onChange={handleChangeEmailRegister}
                            placeholder="Correo electrónico"
                        />
                        <Input
                            type="password"
                            name="password"
                            value={selectedPasswordRegister}
                            onChange={handleChangePasswordRegister}
                            placeholder="Contraseña"
                        />
                        <StyledContainerButton>
                            <StyledButton type="submit">Enviar</StyledButton>
                        </StyledContainerButton>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default Navbar;
