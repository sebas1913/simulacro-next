"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Spinner from "@/components/Spinner/Spinner";
import Card from "@/components/Card/Card";
import { Post } from "@/interfaces/ICard"; // Asegúrate de que la interfaz Post esté correctamente definida
import CreatePost from "@/components/CreatePost/CreatePost";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";

const StyledPostsContainer = styled.div``;

const StyledTitle = styled.h1`
    text-align: center;
    font-size: 3rem;
    padding: 1.5rem;
`;

const StyledButton = styled(Button)`
    margin: 0.8rem;
    width: 8rem;
    padding: 0.6rem;
    color: var(--tertiary-color);
    background: var(--primary-color);
`;

const StyledContainerButton = styled.div`
    text-align: center;
`;

const Title = styled.h1`
    text-align: center;
`;



const PostsPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [postToUpdate, setPostToUpdate] = useState<Post | null>(null); // Almacenar el post a actualizar

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchPosts();
        }
    }, [status, router]);

    const toggleModalUpdate = () => {
        setModalUpdateVisible(!modalUpdateVisible);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/posts");
            if (response.ok) {
                const data = await response.json();
                setPosts(data.posts);
            } else {
                console.error("Error fetching posts:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: number) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postId));
            } else {
                console.error("Error al eliminar la publicación:", response.statusText);
            }
        } catch (error) {
            console.error("Error al eliminar la publicación:", error);
        }
    };

    const handleUpdate = (post: Post) => {
        setPostToUpdate(post); // Guardar el post actual
        toggleModalUpdate(); // Mostrar el modal de actualización
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (postToUpdate) {
            setPostToUpdate({ ...postToUpdate, title: e.target.value });
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (postToUpdate) {
            setPostToUpdate({ ...postToUpdate, description: e.target.value });
        }
    };

    const submitUpdate = async (updatedPost: Post) => {
        try {
            const response = await fetch(`/api/posts/${updatedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPost),
            });

            if (response.ok) {
                setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
                toggleModalUpdate(); // Cerrar el modal
            } else {
                console.error("Error actualizando el post:", response.statusText);
            }
        } catch (error) {
            console.error("Error actualizando el post:", error);
        }
    };

    if (status === "loading" || loading) {
        return <Spinner />;
    }

    if (status === "authenticated") {
        return (
            <>
                <StyledTitle>Hola, {session?.user?.name}</StyledTitle>
                <CreatePost onPostCreated={fetchPosts} />

                <StyledPostsContainer>
                    {posts.map((post) => (
                        <Card
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </StyledPostsContainer>

                {modalUpdateVisible && postToUpdate && (
                    <Modal isVisible={modalUpdateVisible} onClose={toggleModalUpdate}>
                        <Title>Actualizar post</Title>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            submitUpdate(postToUpdate);
                        }}>
                            <Input
                                name="title"
                                type="text"
                                value={postToUpdate.title}
                                onChange={handleTitleChange}
                            />
                            <Input
                                name="description"
                                type="text"
                                value={postToUpdate.description}
                                onChange={handleDescriptionChange}
                            />
                            <StyledContainerButton>
                                <StyledButton type="submit">Actualizar</StyledButton>
                            </StyledContainerButton>
                        </Form>
                    </Modal>
                )}
            </>
        );
    }

    return null;
};

export default PostsPage;
