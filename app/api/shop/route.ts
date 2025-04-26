import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "";
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const transmission = searchParams.get("transmission");
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const minYear = searchParams.get("minYear")
      ? parseInt(searchParams.get("minYear")!)
      : undefined;
    const maxYear = searchParams.get("maxYear")
      ? parseInt(searchParams.get("maxYear")!)
      : undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Construct the base conditions
    const conditions: Prisma.CarWhereInput[] = [
      {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { model: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      // { status: "AVAILABLE" },
      // Always filter to show only cars for sale
      { onSale: true },
      // Make sure salePrice is not null
      { salePrice: { not: null } },
    ];

    // Add optional filters
    if (category) conditions.push({ category: category as any });
    if (brand) conditions.push({ brand: brand as any });
    if (transmission) conditions.push({ carTransmission: transmission as any });
    if (minYear) conditions.push({ year: { gte: minYear } });
    if (maxYear) conditions.push({ year: { lte: maxYear } });

    // Add price-specific conditions for sale price
    if (minPrice) conditions.push({ salePrice: { gte: minPrice } });
    if (maxPrice) conditions.push({ salePrice: { lte: maxPrice } });

    const cars = await db.car.findMany({
      where: {
        AND: conditions,
      },
      include: {
        images: true,
      },
      orderBy: {
        [sortBy]: sortOrder as Prisma.SortOrder,
      },
    });

    // Ensure all cars have the required fields
    const validCars = cars.filter(
      (car) => car.salePrice !== null && car.salePrice !== undefined
    );

    return NextResponse.json(validCars);
  } catch (error) {
    console.error("[SHOP_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
