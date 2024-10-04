import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    try {
        const response = await fetch("https://simuate-test-backend-1.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ message: "Error en el registro" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error en el servidor", error }, { status: 500 });
    }
}
