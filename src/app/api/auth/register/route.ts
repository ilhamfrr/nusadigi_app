import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";
import { db } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json(
            { error: "Email already registered." },
            { status: 409 }
        );
    }

    const user = await userService.create({ name, email, password });

    return NextResponse.json(
        { id: user.id, email: user.email, name: user.name },
        { status: 201 }
    );
}
