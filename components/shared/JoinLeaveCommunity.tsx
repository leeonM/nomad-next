"use client"
import { joinCommunity, likeCommunity } from '@/lib/actions/community.actions'
import { likeTrip } from '@/lib/actions/trip.actions'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useTransition } from 'react'
import { Button } from '../ui/button'

type JoinCommunityProps = {
    id: string
    userId: string
    isMember: boolean
}

const JoinLeaveCommunity = ({id,userId,isMember}:JoinCommunityProps) => {
  const [isPending,startTransition] = useTransition()
  const path = usePathname()

  const joinOrLeaveCommunity = async () => {
    try {
        await joinCommunity({id,userId,path})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
        {!isMember ? (<Button className='text-sm sm:flex rounded-full hover:bg-white hover:text-primary-500'
        onClick={()=>startTransition(joinOrLeaveCommunity)}
        >
        Join
        </Button>)
            :
        (<Button className='text-sm rounded-full sm:flex hover:bg-white hover:text-primary-500'
        onClick={()=>startTransition(joinOrLeaveCommunity)}
        >
            Leave
        </Button>)}
    </>
  )
}

export default JoinLeaveCommunity