"use client"
import { likeCommunity } from '@/lib/actions/community.actions'
import { likeTrip } from '@/lib/actions/trip.actions'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useTransition } from 'react'

type LikedTripProps = {
    id: string
    userId: string
    liked: boolean
    type: 'Community' | 'Trip'
}

const Like = ({id,userId,liked,type}:LikedTripProps) => {
  const [isPending,startTransition] = useTransition()
  const path = usePathname()

  const likeOrUnlike = async () => {
    try {
      if (type === 'Trip'){
        await likeTrip({id,userId,path})
      } else if (type === 'Community'){
        await likeCommunity({id,userId,path})
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className=''>
    {!liked ? (
    <Image 
      src='/assets/icons/heart-outlined.svg'
      alt='heart'
      width={50}
      height={50}
      className='cursor-pointer'
      onClick={()=>startTransition(likeOrUnlike)}
     />
     
     ):
     (
     
     <Image 
      src='/assets/icons/heart-filled.svg'
      alt='heart'
      width={50}
      height={50}
      className='cursor-pointer'
      onClick={()=>startTransition(likeOrUnlike)}
     />
     
     )}
    </div>
  )
}

export default Like