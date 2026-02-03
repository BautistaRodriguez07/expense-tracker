// src/features/user/services/user.service.ts

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const userService = {
  // Sincronizar usuario de Clerk a tu DB
  async syncClerkUser(data: {
    clerkId: string;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  }) {
    try {
      return await prisma.user.upsert({
        where: { clerkId: data.clerkId },
        update: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          imageUrl: data.imageUrl,
          updatedAt: new Date(),
        },
        create: {
          clerkId: data.clerkId,
          email: data.email!,
          firstName: data.firstName,
          lastName: data.lastName,
          imageUrl: data.imageUrl,
        },
      });
    } catch (error) {
      console.error("Error syncing user:", error);
      throw error;
    }
  },

  // Actualizar desde Clerk
  async updateUserFromClerk(data: {
    clerkId: string;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  }) {
    try {
      return await prisma.user.update({
        where: { clerkId: data.clerkId },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          imageUrl: data.imageUrl,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Actualizar usuario Y sincronizar con Clerk
  async updateUser(
    clerkId: string,
    data: {
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    },
  ) {
    try {
      const client = await clerkClient();
      await client.users.updateUser(clerkId, {
        firstName: data.firstName,
        lastName: data.lastName,
      });

      return await prisma.user.update({
        where: { clerkId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  },

  async deleteUser(clerkId: string) {
    return await prisma.user.delete({
      where: { clerkId },
    });
  },

  async syncAllUsers() {
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList();

    for (const user of clerkUsers.data) {
      await this.syncClerkUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      });
    }
  },
};
