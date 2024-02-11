"use server"

import { CreateBlogParams, GetAllTripsParams, UpdateBlogParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Blog from "../database/models/blog.model"
import { handleError } from "../utils"
import { revalidatePath } from "next/cache"

export const createBlog = async ({blog,userId,path}:CreateBlogParams) => {
    try {
        await connectToDatabase()

        const creator = await User.findById(userId)

        if (!creator) {
            throw new Error('Creator not found')
        }


        const newBlog = await Blog.create({
            ...blog,
            creator:userId,
        })


        return JSON.parse(JSON.stringify(newBlog))
    } catch (error) {
        handleError(error)
    }
}

export async function updateBlog({ userId, blog, path }: UpdateBlogParams) {
    try {
      await connectToDatabase()
  
      const blogToUpdate = await Blog.findById(blog._id)
      if (!blogToUpdate || blogToUpdate.organizer.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedBlog = await Blog.findByIdAndUpdate(
        blog._id,
        { ...blog },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedBlog))
    } catch (error) {
      handleError(error)
    }
  }

  export const getBlogById = async (blogId:string) => {
    try {
        await connectToDatabase()

        const blog = await Blog.findById(blogId)

        if (!blog){
            throw new Error('Blog not found')
        }

        return JSON.parse(JSON.stringify(blog))
    } catch (error) {
        handleError(error)
    }
}

export const getAllBlogs = async () => {
    try {
        await connectToDatabase()

        const blogs = await Blog.find()
        .sort({ createdAt: 'desc' })

        return JSON.parse(JSON.stringify(blogs))

    } catch (error) {
        handleError(error)
    }
}