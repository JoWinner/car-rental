import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const { carId } = params;

    const car = await db.car.findUnique({
      where: {
        id: carId,
        onSale: true,
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
    console.error("[SHOP_CAR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 