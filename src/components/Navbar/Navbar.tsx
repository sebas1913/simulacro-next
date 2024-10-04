"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import styles from './Navbar.module.scss'
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Button from "../UI/Button/Button";
import Input from '../UI/Input/Input';
import Modal from "../Modal/Modal";
import Form from "../Form/Form";

const StyledButton = styled(Button)`
    margin: 0.8rem;
    width: 8rem;
    padding: 0.6rem;
    color: var(--tertiary-color);
    background: var(--primary-color);
`;


const Navbar: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    //Form de login
    const [modalLoginVisible, setModalLoginVisible] = useState(false);
    const [selectedEmailLogin, setSelectedEmailLogin] = useState('');
    const [selectedPasswordLogin, setSelectedPasswordLogin] = useState('');

    //Form de registro
    const [modalRegisterVisible, setModalRegisterVisible] = useState(false);
    const [selectedEmailRegister, setSelectedEmailRegister] = useState('');
    const [selectedNameRegister, setSelectedNameRegister] = useState('');
    const [selectedPasswordRegister, setSelectedPasswordRegister] = useState('');

    // Función para mostrar/ocultar modal de login
    const toggleModalLogin = () => {
        setModalLoginVisible(!modalLoginVisible);
    };

    // Manejar los cambios en el input del Register
    const handleChangeNameRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedNameRegister(event.target.value);
    };

    const handleChangeEmailRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmailRegister(event.target.value);
    };

    const handleChangePasswordRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPasswordRegister(event.target.value);
    };

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

    // Envío del formulario de login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Método signIn para autenticar el usuario
        const result = await signIn("credentials", {
            redirect: false,
            email: selectedEmailLogin,
            password: selectedPasswordLogin
        });

        console.log(session);


        if (result?.error) {
            console.log("Error de autenticación:", result.error);
            alert(`Credenciales incorrectas: ${result.error}`);
        } else {
            console.log("Inicio de sesión exitoso");

            // Verifica si la sesión se estableció correctamente
            const session = await getSession(); // Obtén la sesión después del inicio de sesión

            // Si la sesión está disponible, redirige
            if (session) {
                router.push("/posts");
                setModalLoginVisible(false);
                setSelectedEmailLogin('');
                setSelectedPasswordLogin('');
            } else {
                console.error("No se pudo obtener la sesión después del inicio de sesión.");
                alert("Ocurrió un error al iniciar sesión, por favor inténtalo de nuevo.");
            }
        }
    };


    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
    
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: selectedNameRegister,
                    email: selectedEmailRegister,
                    password: selectedPasswordRegister,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error en el registro:", errorData.message);
                alert(`Error en el registro: ${errorData.message}`);
                return;
            }
    
            const data = await response.json();
            alert("Usuario registrado exitosamente :)");
            toggleModalRegister(); // Cerrar el modal de registro
    
            // Limpiar los campos después del registro
            setSelectedNameRegister('');
            setSelectedEmailRegister('');
            setSelectedPasswordRegister('');
            
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Ocurrió un error al registrar. Por favor, intenta de nuevo.");
        }
    };
    


    return (
        <>
            <nav className={styles.StyledNav}>
                {status === "authenticated" ? (
                    <>
                        <h1>POSTS</h1>
                        <StyledButton type="button" onClick={async () => await signOut()}>
                            Cerrar sesión
                        </StyledButton>
                    </>
                ) : (
                    <>
                        <h1>POSTS</h1>
                        <div>
                        <StyledButton type="button" onClick={toggleModalLogin}>
                            Iniciar sesión
                        </StyledButton>
                        <StyledButton type="button" onClick={toggleModalRegister}>
                            Registrarse
                        </StyledButton>
                        </div>
                    </>
                )}
            </nav>

            {/* Modal de inicio de sesión */}
            {!session && (
                <>
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
                            <div className={styles.StyledContainerButton}>
                                <StyledButton type="submit">Enviar</StyledButton>
                            </div>
                        </Form>
                    </Modal>

                    <Modal isVisible={modalRegisterVisible} onClose={toggleModalRegister}>
                    <Form onSubmit={handleRegisterSubmit}>
                        <h1>Regístrate</h1>
                        <Input
                            type="text"
                            name="name"
                            value={selectedNameRegister}
                            onChange={handleChangeNameRegister}
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
                        <div className={styles.StyledContainerButton}>
                            <StyledButton type="submit">Enviar</StyledButton>
                        </div>
                    </Form>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Navbar;
