"use server"

import { CreateCommentParams, CreateTripParams, DeleteTripParams, GetAllTripsParams, GetRelatedTripsByCategoryParams, GetTripsByUserParams, LikeTripParams, UpdateTripParams, GetLikedByUserParams, GetTripsByCommunityParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Trip from "../database/models/trip.model"
import User from "../database/models/user.model"
import Category from "../database/models/category.model"
import { revalidatePath } from "next/cache"
import Comment from "../database/models/comment.model"
import Community from "../database/models/community.model"

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateTrip = (query: any) => {
    return query.populate({ path: 'organizer', model: User, select: '_id firstName username' }).populate({ path: 'category', model: Category, select: '_id name' })
    .populate({
      path:'comments',
      model: Comment,
      select: "_id text userId createdAt",
      populate: {path: 'userId', select: "_id username"}
  })
  }

export const createTrip = async ({trip,userId,communityId,path}:CreateTripParams) => {
    try {
        await connectToDatabase()

        const organizer = await User.findById(userId)

        if (!organizer) {
            throw new Error('Organizer not found')
        }

        let newTrip

        if (!communityId){
          newTrip = await Trip.create({
            ...trip,
            category:trip.categoryId,
            organizer:userId
        })
        }

        if (communityId){
          newTrip = await Trip.create({
            ...trip,
            category:trip.categoryId,
            organizer:userId,
            community: communityId
        })

          await Community.findByIdAndUpdate(communityId, 
            {$push: {trips: newTrip._id}}
          ), {new:true}}

        return JSON.parse(JSON.stringify(newTrip))
    } catch (error) {
        handleError(error)
    }
}

export const getTripById = async (tripId:string) => {
    try {
        await connectToDatabase()

        const trip = await populateTrip(Trip.findById(tripId))

        if (!trip){
            throw new Error('Trip not found')
        }

        return JSON.parse(JSON.stringify(trip))
    } catch (error) {
        handleError(error)
    }
}

export const getAllTrips = async ({query, limit=6, page, category}:GetAllTripsParams) => {
    try {
        await connectToDatabase()

        const titleOrLocationCondition = query ? {
          $or: [
              { title: { $regex: query, $options: 'i' } },
              { tripLocation: { $regex: query, $options: 'i' } }
          ]
      } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
        $and: [titleOrLocationCondition, categoryCondition ? { category: categoryCondition._id } : {}],
      }
  
      const skipAmount = (Number(page) - 1) * limit
      const tripsQuery = Trip.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)

        const trips = await populateTrip(tripsQuery)

        const tripsCount = await Trip.countDocuments(conditions)

        return {
            data:JSON.parse(JSON.stringify(trips)),
            totalPages: Math.ceil(tripsCount / limit)
        }

    } catch (error) {
        handleError(error)
    }
}

export async function updateTrip({ userId, trip, path }: UpdateTripParams) {
    try {
      await connectToDatabase()
  
      const tripToUpdate = await Trip.findById(trip._id)
      if (!tripToUpdate || tripToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedTrip = await Trip.findByIdAndUpdate(
        trip._id,
        { ...trip, category: trip.categoryId },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedTrip))
    } catch (error) {
      handleError(error)
    }
  }


export const deleteTrip = async ({tripId, path}:DeleteTripParams) => {
    try {
        await connectToDatabase()

        const deletedTrip = await Trip.findByIdAndDelete(tripId)

        if (deletedTrip) revalidatePath(path)

    } catch (error) {
        handleError(error)
    }
}

export async function getTripsByUser({ userId, limit = 6, page }: GetTripsByUserParams) {
    try {
      await connectToDatabase()
  
      const conditions = { organizer: userId }
      const skipAmount = (page - 1) * limit
  
      const eventsQuery = Trip.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const trips = await populateTrip(eventsQuery)
      const tripsCount = await Trip.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(trips)), totalPages: Math.ceil(tripsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }

  export async function getTripsByCommunity({ communityId, limit = 6, page }: GetTripsByCommunityParams) {
    try {
      await connectToDatabase()
  
      const conditions = { community: communityId }
      const skipAmount = (page - 1) * limit
  
      const communityQuery = Trip.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const trips = await populateTrip(communityQuery)
      const tripsCount = await Trip.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(trips)), totalPages: Math.ceil(tripsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }

  export async function getRelatedTripsByCategory({
    categoryId,
    tripId,
    limit = 3,
    page = 1,
  }: GetRelatedTripsByCategoryParams) {
    try {
      await connectToDatabase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { $and: [{ category: categoryId }, { _id: { $ne: tripId } }] }
  
      const tripsQuery = Trip.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const trips = await populateTrip(tripsQuery)
      const tripsCount = await Trip.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(trips)), totalPages: Math.ceil(tripsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }

  export async function likeTrip ({
    id, userId, path
  }: LikeTripParams
    ){
    try {
      await connectToDatabase()

      const trip = await Trip.findById(id)
      const user = await User.findById(userId)
        if (trip.likes.includes(user._id)){
            await Trip.findByIdAndUpdate(id, {$pull: {likes: user._id}})
        } else {
            await Trip.findByIdAndUpdate(id, {$push: {likes: user._id}})
        }
    revalidatePath(path)
    } catch (error) {
      handleError(error)
    }
}

export async function createComment ({
  text,
  userId,
  parentId,
  path,
}:CreateCommentParams){
  try {
  await connectToDatabase()

  const currentUser = await User.findById(userId);
  
  if (!currentUser){throw new Error(`You must be logged in to comment`)}

  const createdComment = await Comment.create({
      text,
      userId,
      parentId,
      path
  })
      await Trip.findByIdAndUpdate(parentId, {
          $push: {comments: createdComment._id}
      })

      await User.findByIdAndUpdate(userId, {
        $push: {comments:createdComment._id}
      })

      // TODO: tie comments to users
  
  revalidatePath(path)
  } catch (error) {
      handleError(error)
  }
}

export async function getLikedByUser({ userId, limit = 3, page }: GetLikedByUserParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { likes: userId }

      const tripsQuery = Trip.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const trips = await populateTrip(tripsQuery)
    const tripsCount = await Trip.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(trips)), totalPages: Math.ceil(tripsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}


export const getAllTripsByLocation = async ({query, limit=6, page}:GetAllTripsParams) => {
  try {
      await connectToDatabase()

      const titleCondition = query ? { tripLocation: { $regex: query, $options: 'i' } } : {}
      const conditions = {
      $and: [titleCondition],
    }

    const skipAmount = (Number(page) - 1) * limit
    const tripsQuery = Trip.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

      const trips = await populateTrip(tripsQuery)

      const tripsCount = await Trip.countDocuments(conditions)

      return {
          data:JSON.parse(JSON.stringify(trips)),
          totalPages: Math.ceil(tripsCount / limit)
      }

  } catch (error) {
      handleError(error)
  }
}