import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// GET /api/profile - Get user profile and bookings
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookings = await db.booking.findMany({
      where: {
        userId,
      },
      include: {
        car: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, phoneNumber } = body;

    const userProfile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!userProfile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    const updatedProfile = await db.userProfile.update({
      where: {
        userId,
      },
      data: {
        name,
        phoneNumber,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
