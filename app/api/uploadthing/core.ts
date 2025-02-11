import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAdminUser } from "@/lib/user-profile";

const f = createUploadthing();

export const ourFileRouter = {
  carImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) throw new Error("Unauthorized");
      const isAdmin = await isAdminUser(userId);
      if (!isAdmin) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  carVideo: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) throw new Error("Unauthorized");
      const isAdmin = await isAdminUser(userId);
      if (!isAdmin) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
