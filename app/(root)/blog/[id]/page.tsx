import { getBlogById } from '@/lib/actions/blog.actions'
import Image from 'next/image'
import React from 'react'

const SingleBlogPage = async ({ params }: { params: { id: string } }) => {
    const blog = await getBlogById(params?.id)

  return (
    <>
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex flex-col items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    {blog.title}
                </h3>
                <p className='text-grey-500'>{blog.subTitle}</p>
            </div>
        </section>

        <section className='wrapper my-8'>
            <div className='flex flex-col items-center gap-4'>
                <Image 
                src={blog.imageUrl}
                height={500}
                width={600}
                alt='travel-boat'
                className='rounded-lg'
                />
                <div className='max-w-[800px] gap-2'>
                <p>
                {blog.text}
                </p>
                </div>
            </div>
        </section>
    </>
  )
}

export default SingleBlogPage