import { ICommunity } from '@/lib/database/models/community.model'
import Link from 'next/link'
import React from 'react'

type CommunityCardProps = {
  community: ICommunity,
}

const CommunityCard = ({community}:CommunityCardProps) => {
  return (
    <div className='flex w-full 
     flex-col overflow-hidden 
    rounded-xl bf-white shadow-md transition-all 
    hover:shadow-lg  items-center gap-3 md:gap-4 p-4 max-w-[250px]'>  
            <Link href={`/community/${community._id}`}>
        <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
            {community.name}
        </p>
        </Link>
        <p className='p-semibold-14 w-fit rounded-full 
            bg-grey-500/10 px-4 py-1 text-black line-clamp-1'>
               {community.communityLocation} 
            </p>
        <div className='flex gap-2 items-center'>
        {(community?.likes?.length === 1) ? 
        (<p className='p-medium-12'>{community?.likes?.length} Like</p>):
        (<p className='p-medium-12 text-grey-600'>{community?.likes?.length} Likes</p>)
        }
        -
        {(community?.members?.length === 1) ? 
        (<p className='p-medium-12 text-grey-600'>{community.members?.length} Member</p>):
        (<p className='p-medium-12 '>{community.members?.length} Members</p>)
        }
        -
        {(community?.trips?.length === 1) ? 
        (<p className='p-medium-12 text-grey-600'>{community?.trips?.length} Trip</p>):
        (<p className='p-medium-12 '>{community?.trips?.length} Trips</p>)
        }
      
        </div>
        <p className='p-medium-12 text-primary-500 cursor-pointer'>
                by {community.createdBy.username}
            </p>
        
    </div>
  )
}

export default CommunityCard