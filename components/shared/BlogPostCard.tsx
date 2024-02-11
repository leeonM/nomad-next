import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type BlogCardProps = {
   image: string,
   title: string,
   subTitle: string,
   text: string,
   createdAt: Date,
}

const BlogPostCard = ({image,title,subTitle,createdAt}:BlogCardProps) => {
  return (
    <div className='flex overflow-hidden 
    rounded-xl bf-white shadow-md transition-all 
    hover:shadow-lg cursor-pointer w-full md:w-1/2'>
        <div
        style={{backgroundImage:`url(${image})`}}
        className='flex-center w-1/2 bg-gray-50 bg-center text-grey-500 bg-cover md:w-1/3'
        >
        </div>
        <div className=''>
            <div className='flex flex-col w-full p-4 gap-4'>
            <p className='p-medium-18 md:p-medium-20 line-clamp-2 flex-1 text-black'>
              {title}
            </p>
            <p className='p-medium-14 md:p-medium-16 line-clamp-6 flex-1 text-grey-500'>
                {subTitle}
            </p>
            <p>{formatDateTime(createdAt).dateOnly}</p>
            </div>
        </div>
    </div>
  )
}

export default BlogPostCard