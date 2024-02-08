import CommunityForm from '@/components/shared/CommunityForm'
import TripForm from '@/components/shared/TripForm'
import { fetchCommunityById } from '@/lib/actions/community.actions'
import { auth } from '@clerk/nextjs'
import React from 'react'

type UpdateCommunityProps = {
  params: {
    id: string
  }
}

const UpdateTrip = async ({ params: {id} }:UpdateCommunityProps) => {
    const community = await fetchCommunityById(id)
    const {sessionClaims} = auth()

    const userId = sessionClaims?.userId as string
  return (
    <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center
    py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Update Community</h3>
    </section>

    <div className='wrapper my-8'>
        <CommunityForm 
        userId={userId} 
        type="Update"
        community={community}
        communityId={community._id}
        />
    </div>
    </>
  )
}

export default UpdateTrip