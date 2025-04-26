import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdminUser } from "@/lib/user-profile";
import { CarStatus } from "@prisma/client";

// GET /api/cars/[carId] - Get a single car
export async function GET(
  req: Request,
  { params }: { params: { carId: string } }
) {
  try {
    if (!params.carId) {
      return new NextResponse("Car ID is required", { status: 400 });
    }

    const car = await db.car.findUnique({
      where: {
        id: params.carId,
      },
      include: {
        images: true,
      },
    });

    if (!car) {
      return new NextResponse("Car not found", { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("[CAR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH /api/cars/[carId] - Update a car
export async function PATCH(
  req: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      brand,
      model,
      year,
      rentPrice,
      category,
      description,
      status,
      onSale,
      salePrice,
      onRent,
    } = body;

    if (!Object.values(CarStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Validate sale price if car is on sale
    if (onSale && (!salePrice || salePrice <= 0)) {
      return new NextResponse("Sale price is required when car is on sale", {
        status: 400,
      });
    }

    const car = await db.car.findUnique({
      where: { id: params.carId },
    });

    if (!car) {
      return new NextResponse("Car not found", { status: 404 });
    }

    const updatedCar = await db.car.update({
      where: { id: params.carId },
      data: {
        name,
        brand,
        model,
        year,
        rentPrice,
        category,
        description,
        status,
        onSale,
        salePrice,
        onRent,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("[CAR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/cars/[carId] - Delete a car
export async function DELETE(
  req: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const car = await db.car.delete({
      where: {
        id: params.carId,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error("[CAR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
