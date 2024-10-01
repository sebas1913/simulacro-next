"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";

const PostsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            // Redirigir al usuario al login si no está autenticado
            router.push('/');
        }
    }, [status, router]);

    if (status === "loading") {
        return <Spinner />
    }

    if (status === "authenticated") {
        return (
            <div>
                <h1>Página de Publicaciones</h1>
            </div>
        );
    }

    return null; // Esto nunca debería verse, ya que si no está autenticado se redirige
};

export default PostsPage;
