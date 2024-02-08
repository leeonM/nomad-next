import Collection from '@/components/shared/Collection';
import Comment from '@/components/shared/Comment';
import Comments from '@/components/shared/Comments';
import Like from '@/components/shared/Like';
import { getRelatedTripsByCategory, getTripById, likeTrip } from '@/lib/actions/trip.actions'
import { IComment } from '@/lib/database/models/comment.model';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const TripPage = async ({params:{id},searchParams}: SearchParamProps) => {
  const trip = await getTripById(id);

  const relatedTrips = await getRelatedTripsByCategory({
    categoryId: trip.categoryId,
    tripId: trip._id,
    page: searchParams.page as string
  })

  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string
  const liked = trip.likes.includes(userId)
  const comments = trip?.comments

  return (
    <>
    <section className='flex justify-center bg-grey-50 bg-dotted-pattern bg-contain'>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
            <Image 
            src={trip.imageUrl} 
            alt='Hero image'
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
            />

            <div className='flex w-full flex-col gap-8 p-5 md:p-10'>
              <div className='flex flex-col gap-6'>
                <h2 className='h2-bold'>{trip.title}</h2>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='flex gap-1'>
                    <Image 
                    src='/assets/icons/location.svg'
                    alt='location'
                    width={32}
                    height={32}
                    />
                        <p className='p-bold-20 rounded-full bg-grey-500/10 py-2 px-5
                        line-clamp-1'>{trip.tripLocation}</p>
                        <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 line-clamp-1'>{trip.category.name}</p>
                    </div>
                    <Link href={`/profile/${trip.organizer.username}`}>
                    <p className='p-medium-18 ml-2 mt-2 sm:mt-0 cursor-pointer'>
                       by{' '}
                       <span className='text-primary-500'>{trip.organizer.username}</span>
                    </p>
                    </Link>
                </div>
              </div>

              {/* checkout */}

              <div className='flex flex-col gap-5'>
                  <div className='flex gap-2 md:gap-3'>
                    <Image 
                    src='/assets/icons/calendar.svg'
                    alt='calendar'
                    width={32}
                    height={32}
                    />
                    <div className='p-medium-16 lg:p-regular-20 flex flex-wrap items-center gap-2'>
                      <p>{formatDateTime(trip.startDate).dateOnly}</p> {'to'}
                      <p>{formatDateTime(trip.endDate).dateOnly}</p>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                      <p className='p-bold-20 text-grey-600'>
                        Description
                      </p>
                      <p className='p-medium-16 lg:p-regular-18'>
                        {trip.description}
                      </p>
                      {trip.url && <p className='p-medium-16 lg:p-regular-18 text-primary-500 underline'>
                        {trip.url}
                      </p>}
                      <p>{trip.likes.length} Likes</p>
                     <Like 
                       id={trip._id}
                       userId={userId}
                       liked={liked}
                       type="Trip"
                     />
                  </div>
              </div>
            </div>
        </div>
    </section>

    <section className='wrapper my-8 flex flex-col gap-1'>
    <h2 className='h2-bold mb-2'>Comments ({comments ? comments.length: 0})</h2>
             <div className='border rounded-md'>
              {comments.map((comment:IComment)=>(
                <Comment 
                key={comment?._id.toString()}
                text={comment?.text}
                userId={comment?.userId._id}
                username={comment?.userId.username}
                createdAt={comment?.createdAt}
                />
              ))}
           </div>

     <Comments 
      userId={userId}
      parentId={id}
      />
      
    </section>


    {/* related trips */}
    <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
      <h2 className='h2-bold'>Similar Trips</h2>


      <Collection
          data={relatedTrips?.data}
          emptyTitle="No Trips Found"
          emptyStateSubtext="Why don't you add a trip"
          collectionType="All_Trips"
          limit={6}
          page={1}
          totalPages={2}
          userId={userId}
          />
    </section>

    
    </>
  )
}

export default TripPage