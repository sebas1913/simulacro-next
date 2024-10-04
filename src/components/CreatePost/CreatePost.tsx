"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react"; 
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import styled from "styled-components";

// Estilos
const StyledButtonContainer = styled.div`
    text-align: center;
`;

const StyledButton = styled(Button)`
    margin: 0.7rem;
    width: 10rem;
    padding: 0.6rem;
    color: var(--tertiary-color);
    background: var(--primary-color);
`;

// Interfaz para las props
interface CreatePostProps {
    onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const { data: session } = useSession(); // Traeamos la sesión
    const [modalVisible, setModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");

    // Función para mostrar/ocultar modal
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    // Manejar los cambios en los inputs
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostTitle(event.target.value);
    };

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostDescription(event.target.value);
    };

    // Envío del formulario para crear la publicación
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postTitle || !postDescription) {
            alert("Por favor, completa todos los campos");
            return;
        }

        const response: Response = await fetch("/api/posts", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: postTitle,
                description: postDescription,
                user_id: session?.user?.id,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Publicación creada exitosamente :)");
            setPostTitle("");
            setPostDescription("");
            toggleModal();

            // Llama a la función onPostCreated para recargar los posts
            onPostCreated();
        } else {
            console.log("Error al crear la publicación:", result.message);
            alert(`Error al crear la publicación: ${result.message}`);
        }
    };

    return (
        <>
            <StyledButtonContainer>
                <StyledButton type="button" onClick={toggleModal}>Crear Publicación</StyledButton>
            </StyledButtonContainer>

            {/* Modal para crear publicación */}
            <Modal isVisible={modalVisible} onClose={toggleModal}>
                <Form onSubmit={handleSubmit}>
                    <h1>Crear Publicación</h1>
                    <Input
                        type="text"
                        name="title"
                        value={postTitle}
                        onChange={handleChangeTitle}
                        placeholder="Título"
                    />
                    <Input
                        type="text"
                        name="description"
                        value={postDescription}
                        onChange={handleChangeDescription}
                        placeholder="Descripción"
                    />
                    <StyledButtonContainer>
                        <StyledButton type="submit">Crear</StyledButton>
                    </StyledButtonContainer>
                </Form>
            </Modal>
        </>
    );
};

export default CreatePost;
