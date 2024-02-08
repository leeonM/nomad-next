import TripForm from '@/components/shared/TripForm'
import { auth } from '@clerk/nextjs'
import React from 'react'

const CreateTrip = ({ params }: { params: { id: string } }) => {
    const {sessionClaims} = auth()

    const userId = sessionClaims?.userId as string
    console.log(params.id)
  return (
    <>
    <section className='bg-grey-50 bg-dotted-pattern bg-cover bg-center
    py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Create Trip</h3>
    </section>

    <div className='wrapper my-8'>
        <TripForm userId={userId} communityId={params.id} type="Create" />
    </div>
    </>
  )
}

export default CreateTrip