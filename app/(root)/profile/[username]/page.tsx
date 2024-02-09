import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { socialLinks } from '@/constants'
import { getTripsByUser } from '@/lib/actions/trip.actions'
import { getUserbyUsername } from '@/lib/actions/user.actions'
import { SearchParamProps, SearchUsernameParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UserProfilePage = async ({params: {username},searchParams}:SearchUsernameParamProps) => {
  const user = await getUserbyUsername(username)

  const {sessionClaims} = auth()
  const currentUserId = sessionClaims?.userId as string
  const tripsPage = Number(searchParams?.tripsPage) || 1
  const tripsOrganized = await getTripsByUser({userId:user?._id,page:1})

  return (
    <>
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    {user?.username}'s Profile
                </h3>
                <Button asChild size='lg' className='button hidden sm:flex'>
                    <Link href='/#trips'>
                     Explore More Trips
                    </Link>
                </Button>
            </div>
            </section>
             
            <section className='wrapper my-8'>
              <div className='flex flex-col items-center gap-2'>
              <Image 
              src={user.photo}
              alt='Profile photo'
              height={100}
              width={100}
              className='rounded-full'
              />

             <p className='p-medium-18'>
              {user.firstName}
             </p>
      
             <p className='p-semibold-14 w-fit rounded-full 
            bg-grey-500/10 px-4 py-1 text-black mb-2'>
               {user.userLocation ? `${user.userLocation}` : ''}
            </p>
            
              </div>
              <div className='flex flex-col items-center gap-2'>
              <p className='text-center p-medium-12'>
              {user.bio ? `${user.bio}` : ''}
             </p>
             <p className='p-medium-16 text-primary-500'>
             {user.occupation ? `${user.occupation}` : ''}
             </p>
             <p className='p-medium-16'>
              {user.age ? `${user.age} years old`: ''}
             </p>
             <div className='flex gap-2'>
                {user.instagram && (
                  <a href={user.instagram} target='_blank' rel="noreferrer">
                    <Image src='/assets/icons/instagram.svg'alt='instagram' width={30} height={30} className='cursor-pointer'/>
                  </a>)}
                  {user.facebook && (
                  <a href={user.facebook} target='_blank' rel="noreferrer">
                    <Image src='/assets/icons/facebook.svg'alt='facebook' width={30} height={30} className='cursor-pointer'/>
                  </a>)}
                  {user.tiktok && (
                  <a href={user.tiktok} target='_blank' rel="noreferrer">
                    <Image src='/assets/icons/tiktok.svg'alt='tiktok' width={30} height={30} className='cursor-pointer'/>
                  </a>)}
                  {user.github && (
                  <a href={user.github} target='_blank' rel="noreferrer">
                    <Image src='/assets/icons/github.svg'alt='github' width={30} height={30} className='cursor-pointer'/>
                  </a>)}
                  {user.linkedin && (
                  <a href={user.linkedin} target='_blank' rel="noreferrer">
                    <Image src='/assets/icons/linkedin.svg'alt='linkedin' width={30} height={30} className='cursor-pointer'/>
                  </a>)}
             </div>
              </div>
        </section>

        <section className='wrapper my-8'>
        <h3 className='h3-bold text-center sm:text-left mb-4'>
                    Trips Organized
                </h3>
            <Collection 
                data={tripsOrganized?.data}
                emptyTitle="No Trips Created"
                emptyStateSubtext="Why don't you book a trip and create one"
                collectionType="Trips_Organized"
                limit={6}
                page={tripsPage}
                urlParamName="tripsPage"
                totalPages={tripsOrganized?.totalPages}
                userId={currentUserId}
          />
        </section>
        </>
  )
}

export default UserProfilePage