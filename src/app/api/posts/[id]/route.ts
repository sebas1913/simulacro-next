import { NextResponse } from 'next/server';

// Método DELETE - Eliminar un post específico
export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<NextResponse>  {
  const { id } = params;  
  try {
    const response = await fetch(`https://simuate-test-backend-1.onrender.com/api/posts/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Error deleting post' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post', details: error }, { status: 500 });
  }
}

// Método PATCH - Actualizar un post específico
export async function PUT(req: Request, { params }: { params: { id: string } }): Promise<NextResponse>  {
  const { id } = params;
  try {
    const body = await req.json(); // Obtener los datos de la solicitud, titulo, descripción
    const response = await fetch(`https://simuate-test-backend-1.onrender.com/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Error updating post' }, { status: response.status });
    }

    const updatedPost = await response.json();
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post', details: error }, { status: 500 });
  }
}
