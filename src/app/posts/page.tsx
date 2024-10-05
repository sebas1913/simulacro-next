"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Spinner from "@/components/Spinner/Spinner";
import Card from "@/components/Card/Card";
import CreatePost from "@/components/CreatePost/CreatePost";
import Modal from "@/components/Modal/Modal";
import Form from "@/components/Form/Form";
import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";
import Cookies from "js-cookie"; 

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

const StyledContainerLang = styled.div`
    position: fixed;
    bottom: 1rem;
    left: 1rem;
`;

const StyledButtonLang = styled(Button)`
    margin: 0.2rem;
    width: 3rem;
    padding: 0.6rem;
    color: var(--tertiary-color);
    background: var(--primary-color);
`

const StyledContainerUpdate = styled.div`
    text-align: center;
`

const PostsPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [postToUpdate, setPostToUpdate] = useState<any | null>(null);
    const [language, setLanguage] = useState<string>('en');
    const [texts, setTexts] = useState<any>({});

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchPosts();
            loadLanguage();
        }
    }, [status, router]);

    const loadLanguage = () => {
        const lang = Cookies.get('language') || 'es';
        setLanguage(lang);
        fetch(`/messages/${lang}.json`)
            .then(response => response.json())
            .then(data => setTexts(data));
    };

    const changeLanguage = (lang: string) => {
        Cookies.set('language', lang, { expires: 30 });
        loadLanguage();
    };

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

    const handleUpdate = (post: any) => {
        setPostToUpdate(post);
        toggleModalUpdate();
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

    const submitUpdate = async (updatedPost: any) => {
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
                toggleModalUpdate();
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

    return (
        <>
            <StyledTitle>{texts.greeting}, {session?.user?.name}</StyledTitle>
            <CreatePost onPostCreated={fetchPosts} texts={texts} /> {/* Pasamos texts como prop */}

            <StyledContainerLang>
                <StyledButtonLang type="button" onClick={() => changeLanguage('es')}>ES</StyledButtonLang>
                <StyledButtonLang type="button" onClick={() => changeLanguage('en')}>EN</StyledButtonLang>
            </StyledContainerLang>

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
                    <Form onSubmit={(e) => { e.preventDefault(); submitUpdate(postToUpdate); }}>
                        <h1>{texts.updatePost}</h1>
                        <Input
                            name="title"
                            type="text"
                            value={postToUpdate.title}
                            onChange={handleTitleChange}
                            placeholder={texts.titlePlaceholder}
                        />
                        <Input
                            name="title"
                            type="text"
                            value={postToUpdate.description}
                            onChange={handleDescriptionChange}
                            placeholder={texts.descriptionPlaceholder}
                        />
                        <StyledContainerUpdate>
                            <StyledButton type="submit">{texts.update}</StyledButton>
                        </StyledContainerUpdate>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default PostsPage;
