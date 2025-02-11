import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";



export const userProfile = async (userId: string | null) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth()

  if (!user) {
    return redirectToSignIn();
  }
 
  // Try to find existing user
    const existingUserProfile = await db.userProfile.findUnique({
    where: { userId: user.id }
  });



  if (existingUserProfile) {
    // Update existing user if needed
    return await db.userProfile.update({
      where: { userId: user.id },


      data: {
        // name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
      }
    });
  }

  // Create new user if doesn't exist
  return await db.userProfile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      isAdmin: false,
    }
  });
};

export async function isAdminUser(userId: string | null) {
  if (!userId) return false;
  
  const userProfile = await db.userProfile.findUnique({
    where: { 
      userId,
      isAdmin: true,
      isActive: true
    }
  });


  return !!userProfile;

}