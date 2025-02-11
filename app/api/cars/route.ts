import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdminUser } from "@/lib/user-profile";
import { CarBrand, CarCategory, CarStatus, Prisma } from "@prisma/client";

// GET /api/cars - Get all cars with pagination and filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Filter params
    const brand = searchParams.get("brand") as CarBrand | null;
    const category = searchParams.get("category") as CarCategory | null;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const minSeats = searchParams.get("minSeats")
      ? parseInt(searchParams.get("minSeats")!)
      : undefined;
    const status =
      (searchParams.get("status") as CarStatus) || CarStatus.AVAILABLE;
    const search = searchParams.get("search") || "";

    // Build filter conditions
    const where: Prisma.CarWhereInput = {
      ...(status && { status }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(minSeats && { seats: { gte: minSeats } }),
      ...(search && {
        OR: [
          {
            name: { contains: search, mode: "insensitive" as Prisma.QueryMode },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            model: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }),
    };

    // Get total count for pagination
    const total = await db.car.count({ where });

    // Get cars with filters and pagination
    const cars = await db.car.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      cars,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[CARS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/cars - Create a new car
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("[CARS_POST] Request body:", body);

    const { images, ...carData } = body;

    if (!Array.isArray(images)) {
      return new NextResponse("Images must be an array", { status: 400 });
    }

    // Create the car with properly formatted image data
    const car = await db.car.create({
      data: {
        ...carData,
        images: {
          createMany: {
            data: images.map((url: string) => ({
              url,
            })),
          },
        },
      },
      include: {
        images: true,
      },
    });

    console.log("[CARS_POST] Created car:", car);
    return NextResponse.json(car);
  } catch (error) {
    console.error("[CARS_POST] Error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}
