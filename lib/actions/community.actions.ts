"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Community from "../database/models/community.model";
import Trip from "../database/models/trip.model";
import { CreateCommunityParams, GetAllCommunitiesParams, GetAllTripsParams, JoinCommunityParams, LikeCommunityParams, UpdateCommunityParams } from "@/types";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

const populateCommunity = (query: any) => {
    return query.populate({ path: 'createdBy', model: User}).populate({ path: 'trips', model: Trip }).populate({path:'members',model: User,select: "_id username userId photo"})
  }

export async function createCommunity({
  userId,
  community,
  path
}:CreateCommunityParams) {
  try {
    await connectToDatabase();

    // Find the user with the provided unique id
    const user = await User.findById(userId)

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

        const newCommunity = await Community.create({
            ...community,
            createdBy: userId
        })

        const newCommunityUpdate = await Community.findByIdAndUpdate(newCommunity._id,
            {$push: {members: user._id}}, { new: true })
        
            revalidatePath(path)
        return JSON.parse(JSON.stringify(newCommunityUpdate))
  } catch (error) {
    handleError(error)

  }
}

export async function fetchCommunityById(communityId: string){
    try {
        await connectToDatabase()

        const community = await populateCommunity(Community.findById(communityId))

        if (!community){
            throw new Error('Trip not found')
        }

        return JSON.parse(JSON.stringify(community))      
    } catch (error) {
        handleError(error)
    }
}

// export async function fetchCommunityDetails(id: string) {
//   try {
//     await connectToDatabase()

//     // populate trips
//     const communityDetails = await Community.findOne({ id }).populate([
//       "createdBy",
//       {
//         path: "members",
//         model: User,
//         select: "name username image _id id",
//       },
//     ]).populate({ path: 'trips', model: Trip, select: '_id title description tripLocation createdAt imageUrl startDate endDate url category organizer community likes comments' })

//     return communityDetails;
//   } catch (error) {
//     handleError(error)

//   }
// }

// export async function fetchCommunityPosts(id: string) {
//   try {
//     connectToDB();

//     const communityPosts = await Community.findById(id).populate({
//       path: "threads",
//       model: Thread,
//       populate: [
//         {
//           path: "author",
//           model: User,
//           select: "name image id", // Select the "name" and "_id" fields from the "User" model
//         },
//         {
//           path: "children",
//           model: Thread,
//           populate: {
//             path: "author",
//             model: User,
//             select: "image _id", // Select the "name" and "_id" fields from the "User" model
//           },
//         },
//       ],
//     });

//     return communityPosts;
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching community posts:", error);
//     throw error;
//   }
// }

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectToDatabase();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { communityLocation: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    await connectToDatabase();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    await connectToDatabase();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function likeCommunity ({
    id, userId, path
  }: LikeCommunityParams
    ){
    try {
      await connectToDatabase()

      const community = await Community.findById(id)
      const user = await User.findById(userId)
        if (community.likes.includes(user._id)){
            await Community.findByIdAndUpdate(id, {$pull: {likes: user._id}})
        } else {
            await Community.findByIdAndUpdate(id, {$push: {likes: user._id}})
        }
    revalidatePath(path)
    } catch (error) {
      handleError(error)
    }
}

export async function updateCommunityInfo({userId, community,path}:UpdateCommunityParams) {
  try {
    await connectToDatabase();

  
      const communityToUpdate = await Community.findById(community._id)
      if (!communityToUpdate || communityToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or community not found')
      }
  
      const updatedCommunity = await Trip.findByIdAndUpdate(
        community._id,
        { ...community},
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedCommunity))
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    await connectToDatabase();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }


    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

export async function joinCommunity ({
    id, userId, path
  }: JoinCommunityParams
    ){
    try {
      await connectToDatabase()

      const community = await Community.findById(id)
      const user = await User.findById(userId)
        if (community.members.includes(user._id)){
            await Community.findByIdAndUpdate(id, {$pull: {members: user._id}})
        } else {
            await Community.findByIdAndUpdate(id, {$push: {members: user._id}})
        }
    revalidatePath(path)
    } catch (error) {
      handleError(error)
    }
}

export const getAllCommunities = async ({communityQuery, limit=6, page}:GetAllCommunitiesParams) => {
  try {
      await connectToDatabase()

      const titleOrLocationCondition = communityQuery ? {
        $or: [
            { name: { $regex: communityQuery, $options: 'i' } },
            { communityLocation: { $regex: communityQuery, $options: 'i' } }
        ]
    } : {}
    
      const conditions = {
      $and: [titleOrLocationCondition],
    }

    const skipAmount = (Number(page) - 1) * limit
    const communitiesQuery = Community.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

      const communities = await populateCommunity(communitiesQuery)

      const communityCount = await Community.countDocuments(conditions)

      return {
          data:JSON.parse(JSON.stringify(communities)),
          totalPages: Math.ceil(communityCount / limit)
      }

  } catch (error) {
      handleError(error)
  }
}