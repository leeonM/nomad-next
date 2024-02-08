import Collection from '@/components/shared/Collection'
import JoinLeaveCommunity from '@/components/shared/JoinLeaveCommunity'
import Like from '@/components/shared/Like'
import UserProfileCard from '@/components/shared/UserProfileCard'
import { Button } from '@/components/ui/button'
import { fetchCommunityById } from '@/lib/actions/community.actions'
import { getTripsByCommunity } from '@/lib/actions/trip.actions'
import { CommunityParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CommunityPage = async ({params:{id},searchParams}: CommunityParamProps) => {
  const community = await fetchCommunityById(id);
  const trips = await getTripsByCommunity({communityId:id,page:1})


  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string
  const liked = community.likes.includes(userId)
  const communityCreator = community.createdBy._id.toString() === userId
  const tripsPage = Number(searchParams?.tripsPage) || 1
  const isMember = community.members.some((member:any)=> member._id === userId)

  // console.log(community.trips)
  return (
    <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex flex-col gap-2 sm:gap-0 sm:flex-row items-center justify-center sm:justify-between'>
            <h3 className='h3-bold text-center sm:text-left'>
                {community.name}
            </h3>
            <div className='flex gap-2 flex-col items-center sm:flex-row'>
              {isMember &&
               ( 
               <Link href={`/trips/create/${community._id}`}>
               <Button className='rounded-full'>
                  Create Trip
                </Button>
                </Link>
                )
              }
            {communityCreator && <Button variant='destructive' className='text-sm sm:flex rounded-full hover:bg-white hover:text-red-600 hover:border hover:border-red-600'>
                     Delete Community
              </Button>}
            {communityCreator && 
            <Link href={`/community/${community._id}/update`}>
              <Button className='sm:flex text-sm rounded-full bg-white border border-primary-500 text-primary-500 hover:text-white'>
                     Update Details
              </Button>
            </Link>
              
              }

            <JoinLeaveCommunity
              id={community._id}
              userId={userId}
              isMember={isMember}
            />
            </div>
        </div>
      </section>
      <section className='flex justify-center bg-dotted-pattern bg-contain'>
      <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
      <div className='flex w-full flex-col gap-8 p-5 md:p-10 sticky'>
              <div className='flex flex-col gap-6'>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='flex gap-1'>
                    <Image 
                    src='/assets/icons/location.svg'
                    alt='location'
                    width={32}
                    height={32}
                    />
                        <p className='p-bold-20 rounded-full bg-grey-500/10 py-2 px-5
                        line-clamp-1'>{community.communityLocation}</p>
                    </div>
                    <p className='p-medium-18 ml-2 mt-2 sm:mt-0 cursor-pointer'>
                       by{' '}
                       <span className='text-primary-500'>{community.createdBy.username}</span>
                    </p>
                    <Like 
                       id={community._id}
                       userId={userId}
                       liked={liked}
                       type='Community'
                     />
                     {(community.likes.length === 1) ? 
                      (<p className='p-medium-14'>{community.likes.length} Like</p>):
                      (<p className='p-medium-14'>{community.likes.length} Likes</p>)
                      }
                </div>
              </div>

              {/* checkout */}

              <div className='flex flex-col gap-5'>
                  <div className='flex flex-col gap-2'>
                      <p className='p-bold-20 text-grey-600'>
                        Bio
                      </p>
                      <p className='p-medium-16 lg:p-regular-18'>
                        {community.bio}
                      </p>
    
                  </div>
              </div>
            </div>
            <div className='flex flex-col overflow-scroll p-5 gap-8'>
            <h2 className='h2-bold mt-5'>Members ({community.members.length})</h2>
            <div className='gap-5'>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
                      {community.members.map((member:any)=>(
                        <Link href={`/profile/${member.username}`} key={member._id}>
                           <UserProfileCard username={member.username} photo={member.photo} />
                        </Link>
                      ))}
                  </div>
              </div>

            </div>
              {/* descript */}
           


        </div>
      </section>
    <section className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
      <h2 className='h2-bold'>Trips</h2>
          {/* trips */}

          <Collection 
                data={trips?.data}
                emptyTitle="No Community trips"
                emptyStateSubtext="Why don't you post a trip"
                collectionType="Trips_Organized"
                limit={3}
                page={tripsPage}
                totalPages={trips?.totalPages}
                urlParamName='likedPage'
                userId={userId}
          />
    </section>

       
    </>
  )
}

export default CommunityPage