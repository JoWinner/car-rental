import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { SaleOrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { carId, name, email, phone, message } = body;
    
    if (!carId || !name || !email || !phone) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Check if car exists and is for sale
    const car = await db.car.findUnique({
      where: {
        id: carId,
        onSale: true,
      },
    });
    
    if (!car) {
      return new NextResponse("Car not found or not available for sale", { status: 404 });
    }
    
    // Create the sale order
    const saleOrder = await db.saleOrder.create({
      data: {
        carId,
        name,
        email,
        phone,
        message,
        userId: userId || null, // Link to user if authenticated
        status: SaleOrderStatus.PENDING,
      },
    });
    
    return NextResponse.json(saleOrder);
  } catch (error) {
    console.error("[SALE_ORDERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    // For security, verify that user is admin if admin-only query
    if (isAdmin) {
      const user = await db.userProfile.findUnique({
        where: { userId: userId as string },
        select: { isAdmin: true },
      });
      
      if (!user?.isAdmin) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
      
      // Admin can see all orders
      const allOrders = await db.saleOrder.findMany({
        include: {
          car: {
            include: {
              images: {
                take: 1,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
      return NextResponse.json(allOrders);
    }
    
    // If not admin request, check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Regular users can only see their own orders
    const userOrders = await db.saleOrder.findMany({
      where: {
        userId: userId,
      },
      include: {
        car: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("[SALE_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 