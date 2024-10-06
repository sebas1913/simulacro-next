import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse>  {
  try {
    const response: Response = await fetch('https://simuate-test-backend-1.onrender.com/api/posts');
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Error fetching posts' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error fetching posts', details: error }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse>  {
  try {
    const { title, description, user_id } = await request.json();

    const response = await fetch('https://simuate-test-backend-1.onrender.com/api/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        user_id,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Error creating post' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error creating post', details: error }, { status: 500 });
  }
}
