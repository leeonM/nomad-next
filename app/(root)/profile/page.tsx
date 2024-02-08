import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getLikedByUser, getTripsByUser } from '@/lib/actions/trip.actions'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const MyProfilePage = async ({searchParams}:SearchParamProps) => {

  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string

  const likedPage = Number(searchParams?.likedPage) || 1
  const tripsPage = Number(searchParams?.tripsPage) || 1
  
  const liked = await getLikedByUser({userId, page: likedPage})
  const tripsOrganized = await getTripsByUser({userId,page:1})

  return (
    <>
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    My Liked Trips
                </h3>
                <Button asChild size='lg' className='button hidden sm:flex'>
                    <Link href='/profile/update'>
                     Update Profile
                    </Link>
                </Button>
            </div>
        </section>
        <section className='wrapper my-8'>
            {/* my trips */}
            <Collection 
                data={liked?.data}
                emptyTitle="No Trips Liked"
                emptyStateSubtext="Why don't you look for some trips"
                collectionType="My_Liked"
                limit={3}
                page={likedPage}
                totalPages={liked?.totalPages}
                urlParamName='likedPage'
                userId={userId}
          />
        </section>

        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            {/* my liked trips */}
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    My Trips
                </h3>
                <Button asChild size='lg' className='button hidden sm:flex'>
                    <Link href='/trips/create'>
                     Create New Trip
                    </Link>
                </Button>
            </div>
        </section>

        <section className='wrapper my-8'>
            {/* my trips */}
            <Collection 
                data={tripsOrganized?.data}
                emptyTitle="No Trips Created"
                emptyStateSubtext="Why don't you book a trip and create one"
                collectionType="Trips_Organized"
                limit={6}
                page={tripsPage}
                urlParamName="tripsPage"
                totalPages={tripsOrganized?.totalPages}
                userId={userId}
          />
        </section>
    </>
  )
}

export default MyProfilePage