"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Modal from "../Modal/Modal";
import Form from "../Form/Form";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import styled from "styled-components";

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

interface CreatePostProps {
    onPostCreated: () => void;
    texts: any; // Agregamos texts como prop
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, texts }) => {
    const { data: session } = useSession();
    const [modalVisible, setModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostTitle(event.target.value);
    };

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostDescription(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postTitle || !postDescription) {
            alert(texts.completeFields); // Usamos el texto traducido
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
            alert(texts.postCreated); // Usamos el texto traducido
            setPostTitle("");
            setPostDescription("");
            toggleModal();
            onPostCreated();
        } else {
            console.log("Error al crear la publicación:", result.message);
            alert(`${texts.errorCreatingPost}: ${result.message}`); // Usamos el texto traducido
        }
    };

    return (
        <>
            <StyledButtonContainer>
                <StyledButton type="button" onClick={toggleModal}>
                    {texts.createPost} {/* Texto traducido */}
                </StyledButton>
            </StyledButtonContainer>

            <Modal isVisible={modalVisible} onClose={toggleModal}>
                <Form onSubmit={handleSubmit}>
                    <h1>{texts.createPost}</h1> 
                    <Input
                        type="text"
                        name="title"
                        value={postTitle}
                        onChange={handleChangeTitle}
                        placeholder={texts.titlePlaceholder} 
                    />
                    <Input
                        type="text"
                        name="description"
                        value={postDescription}
                        onChange={handleChangeDescription}
                        placeholder={texts.descriptionPlaceholder} 
                    />
                    <StyledButtonContainer>
                        <StyledButton type="submit">{texts.create}</StyledButton>
                    </StyledButtonContainer>
                </Form>
            </Modal>
        </>
    );
};

export default CreatePost;
