import { ITrip } from '@/lib/database/models/trip.model'
import { formatDateTime } from '@/lib/utils'
import { auth, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'

type CardProps = {
    trip: ITrip,
    isOrganizer: boolean,
    hasLiked: boolean,
}

const Card = ({trip,isOrganizer,hasLiked}:CardProps) => {

  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string
  const isTripCreator = trip.organizer._id.toString() === userId
  const eventDate = new Date(trip.endDate); 
  const currentDate = new Date();

  const tripHasOccurred = currentDate > eventDate;

  const beforeEventStyle = { backgroundImage: `url(${trip.imageUrl})` };
  const afterEventStyle = {
    backgroundImage: `url(${trip.imageUrl})`,
    filter: 'grayscale(100%)',
  };


  return (
    <div className='group relative flex min-h-[380px] w-full 
    max-w-[400x] flex-col overflow-hidden 
    rounded-xl bf-white shadow-md transition-all 
    hover:shadow-lg md:min-h-[438px]'>
        <Link href={`/trips/${trip._id}`}
        style={tripHasOccurred ? afterEventStyle : beforeEventStyle}
        className={`flex-center flex-grow bg-gray-50 bg-cover bg-center text-red-200`}
        >
          {tripHasOccurred && (
            <div className="absolute inset-0 flex-center z-10">
            <span className="font-bold text-3xl">Trip Ended</span>
          </div>
          )}
        </Link>

        {isTripCreator && (
            <div className='absolute right-2 top-2 flex flex-col gap-4 
            rounded-xl bg-white p-3 shadow-sm transition-all'>
                {!tripHasOccurred && <Link href={`/trips/${trip._id}/update`}>
                    <Image 
                    src='/assets/icons/edit.svg'
                    alt='Edit'
                    width={20}
                    height={20}
                    />
                </Link>}

                {tripHasOccurred && <DeleteConfirmation 
                 tripId={trip._id}
                />}
            </div>
        )}
        <div
        className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'
        >
        <div className='flex gap-2'>
            <p className='p-semibold-14 w-fit rounded-full 
            bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1'>
               {trip.category.name} 
            </p>
            <p className='p-semibold-14 w-fit rounded-full 
            bg-grey-500/10 px-4 py-1 text-black line-clamp-1'>
               {trip.tripLocation} 
            </p>
            {tripHasOccurred && (
             <p className='p-semibold-14 w-fit rounded-full 
             bg-grey-500/10 px-4 py-1 text-red-600 line-clamp-1'>
                Trip Ended
             </p>
            )}
        </div>

        <p className='p-medium-14 text-grey-500 gap-2'>
            {formatDateTime(trip.startDate).dateOnly} {'to '}        
            {formatDateTime(trip.endDate).dateOnly}
        </p>
        <Link href={`/trips/${trip._id}`}>
        <p className='p-medium-14 md:p-medium-16 line-clamp-2 flex-1 text-black'>
            {trip.title}
        </p>
        </Link>
        <div className='flex flex-col w-full'>
        <p className='text-xs'>{trip.description.substring(0,50)}...</p>

        <div className='flex gap-2 items-center mt-2'>
        {(trip.likes.length === 1) ? 
        (<p className='p-medium-12'>{trip.likes.length} Like</p>):
        (<p className='p-medium-12 text-grey-600'>{trip.likes.length} Likes</p>)
        }
        -
        {(trip.comments.length === 1) ? 
        (<p className='p-medium-12 text-grey-600'>{trip.comments.length} Comment</p>):
        (<p className='p-medium-12 '>{trip.comments.length} Comments</p>)
        }
        </div>
            <Link href={`/profile/${trip.organizer.username}`}>
            <p className='p-medium-12 text-primary-500 cursor-pointer'>
                by {trip.organizer.username}
            </p>
            </Link>
        </div>
        </div>
    </div>
  )
}

export default Card