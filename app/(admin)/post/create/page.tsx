import BlogForm from '@/components/shared/BlogForm'
import { auth } from '@clerk/nextjs'
import React from 'react'

const CreateBlog = () => {
    const {sessionClaims} = auth()

    const userId = sessionClaims?.userId as string
  return (
    <>
    <section className='bg-grey-50 bg-dotted-pattern bg-cover bg-center
    py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Create Blog Post</h3>
    </section>

    <div className='wrapper my-8'>
        <BlogForm userId={userId} type="Create" />
    </div>
    </>
  )
}

export default CreateBlog