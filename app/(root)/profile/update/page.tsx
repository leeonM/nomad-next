import EditProfileForm from '@/components/shared/EditProfileForm'
import { getUserById } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs'
import React from 'react'

const EditProfilePage = async () => {
    const {sessionClaims} = auth()
    const userId = sessionClaims?.userId as string
    const user = await getUserById(userId)
  return (
    <>
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center
    py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Update Profile</h3>
    </section>

    <div className='wrapper my-8'>
        <EditProfileForm 
          userId={userId}
          user={user}
        />
    </div>
    </>
  )
}

export default EditProfilePage