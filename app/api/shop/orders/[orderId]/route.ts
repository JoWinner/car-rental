import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { SaleOrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = await auth();
    const { orderId } = params;
    const body = await req.json();
    const { status } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify that user is an admin
    const user = await db.userProfile.findUnique({
      where: { userId: userId as string },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Check if status is valid
    if (!Object.values(SaleOrderStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Update the order status
    const updatedOrder = await db.saleOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[SALE_ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 