import Link from 'next/link'
import React from 'react'

const Posts = () => {
  return (
    <>
      <section className='wrapper my-8'>
            <div className='flex flex-col items-center gap-4'>
                <Link href='/post/create'>
                  Create Post
                </Link>
                
                {/* posts */}
            </div>
        </section>
    </>
  )
}

export default Posts