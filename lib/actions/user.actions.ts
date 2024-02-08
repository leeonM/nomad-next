'use server'

import { CreateUserParams, GetUserByUsernameParams, UpdateClerkUserParams, UpdateUserParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Trip from "../database/models/trip.model"
import { revalidatePath } from "next/cache"

export const createUser = async (user:CreateUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    

    // get a javascript object of the user
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateClerkUserParams) {
    try {
      await connectToDatabase()
  
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }
  
  export async function deleteUser(clerkId: string) {
    try {
      await connectToDatabase()
  
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId })
  
      if (!userToDelete) {
        throw new Error('User not found')
      }
  
      // Unlink relationships
      await Promise.all([
        // Update the 'events' collection to remove references to the user
        Trip.updateMany(
          { _id: { $in: userToDelete.trips } },
          { $pull: { organizer: userToDelete._id } }
        ),
        
        // TODO: Update community to remove user
        // Update the 'orders' collection to remove references to the user
        // Trip.updateMany({ _id: { $in: userToDelete.trips } }, { $unset: { organizer: 1 } }),
      ])
  
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id)
      revalidatePath('/')
  
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
      handleError(error)
    }
  }

  export async function getUserbyUsername(username:string){
    try {
      await connectToDatabase()
      const condition = {username: username}

      const user = await User.findOne(condition)

      return JSON.parse(JSON.stringify(user))
    } catch (error) {
      handleError(error)
    }
  }

  export async function getUserByIdAndUpdate({
    userId,
    user,
    path
  }:UpdateUserParams
  ){
    try {
      await connectToDatabase()


    const updatedUser = await User.findOneAndUpdate(
      {_id:userId}, 
      {
        username:user.username,
        bio:user.bio,
        userLocation:user.userLocation,
        firstName:user.firstName,
        instagram: user.instagram,
        photo:user.photo,
        tiktok: user.tiktok,
        linkedin: user.linkedin,
        github: user.github,
        facebook: user.facebook,
        occupation: user.occupation,
        age: user.age,
    },{upsert: true})

    revalidatePath(path)

      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }

  export async function getUserById(userId: string){
    try {
      await connectToDatabase()

      const user = await User.findById(userId)
      return JSON.parse(JSON.stringify(user))
    } catch (error) {
      handleError(error)
    }
  }


  
