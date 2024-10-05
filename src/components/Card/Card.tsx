import React from "react";
import styled from "styled-components";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { Post } from "@/interfaces/ICard";
import Button from "../UI/Button/Button";

const StyledCard = styled.div`
    border-radius: 0.5rem;
    border: 0.1rem solid var(--light-gray);
    padding: 1rem;
    width: 40%;
    margin: 1rem auto;
    cursor: pointer;
`;

const StyledTitle = styled.h2`
    font-size: 1.5rem;
    color: var(--primary-color);
`;

const StyledDescription = styled.p`
    font-size: 1rem;
    color: var(--secundary-color);
`;

const StyledUserId = styled.span`
    font-size: 0.8rem;
    color: var(--secundary-color);
`;

const StyledButtonContainer = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const StyledButton = styled(Button)`
    margin: 0.1rem;
    width: 7rem;
    padding: 0.4rem;
    color: var(--tertiary-color);
    background: var(--primary-color);
`;

const UpdateButton = styled(StyledButton)`
    background-color: var(--primary-color);
`;

const DeleteButton = styled(StyledButton)`
    background-color: var(--primary-color);
`;

interface CardProps {
    post: Post;
    onUpdate: (post: Post) => void;
    onDelete: (postId: number) => void;
}

const Card: React.FC<CardProps> = ({ post, onUpdate, onDelete }) => {
    const handleDelete = () => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta publicación?");
        if (confirmed) {
            onDelete(post.id);
        }
    };

    return (
        <StyledCard>
            <StyledTitle>{post.title}</StyledTitle>
            <StyledDescription>{post.description}</StyledDescription>
            <StyledUserId>Usuario: {post.user_id}</StyledUserId>

            <StyledButtonContainer>
                {/* Botón para actualizar */}
                <UpdateButton type="button" onClick={() => onUpdate(post)}>
                    <FiEdit />
                </UpdateButton>

                {/* Botón para eliminar */}
                <DeleteButton type="button" onClick={handleDelete}>
                    <MdDeleteOutline />
                </DeleteButton>
            </StyledButtonContainer>
        </StyledCard>
    );
};

export default Card;
