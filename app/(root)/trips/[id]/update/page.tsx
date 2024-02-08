import TripForm from '@/components/shared/TripForm'
import { getTripById } from '@/lib/actions/trip.actions'
import { UpdateTripParams } from '@/types'
import { auth } from '@clerk/nextjs'
import React from 'react'

type UpdateTripProps = {
  params: {
    id: string
  }
}

const UpdateTrip = async ({ params: {id} }:UpdateTripProps) => {
    const trip = await getTripById(id)
    const {sessionClaims} = auth()

    const userId = sessionClaims?.userId as string
  return (
    <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center
    py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Update Trip</h3>
    </section>

    <div className='wrapper my-8'>
        <TripForm 
        userId={userId} 
        type="Update"
        trip={trip}
        tripId={trip._id}
        />
    </div>
    </>
  )
}

export default UpdateTrip