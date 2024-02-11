import BlogPostCard from '@/components/shared/BlogPostCard'
import { getAllBlogs } from '@/lib/actions/blog.actions'
import { IBlog } from '@/lib/database/models/blog.model'
import Link from 'next/link'
import React from 'react'

const BlogPage = async () => {
    const blogs = await getAllBlogs()

  return (
    <>
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    Nomas Blog
                </h3>
            </div>
        </section>

        <section className='wrapper my-8'>
            <div className='flex flex-col gap-5'>
                {blogs?.map((blog:any)=>(
                    <Link href={`/blog/${blog._id}`} key={blog._id}>
                        <BlogPostCard
                         image={blog.imageUrl}
                         title={blog.title}
                         text={blog.text}
                         subTitle={blog.subTitle}
                         createdAt={blog.createdAt}
                        />
                    </Link>
                ))}
            </div>
        </section>
    </>
  )
}

export default BlogPage