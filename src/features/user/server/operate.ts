'use server'

import {db} from '@/lib/prismaClient' 

export async function insertUser() {
  return await db.blogs.create({
    data: {
      Title: "string",
      BlogType: "string",
      Description: "string",
      Created: false,
      Updated: false,
      FileUploaded: "string",
      IsActive: false,
      IsDeleted: false,
      createdAt: new Date(),  // Add createdAt
      updatedAt: new Date(),  // Add updatedAt
    }
  })
}

