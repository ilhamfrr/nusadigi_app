import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { tenantService } from "@/lib/services/tenant.service";
import { z } from "zod";

const createTenantSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    primaryColor: z.string().optional(),
    companyName: z.string().optional(),
    supportEmail: z.string().email().optional(),
});

export async function GET(request: NextRequest) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const result = await tenantService.getAll(page, limit);
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createTenantSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const tenant = await tenantService.create(parsed.data);
    return NextResponse.json(tenant, { status: 201 });
}
