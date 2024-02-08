import Image from 'next/image'
import React from 'react'

type ProfileCardProps = {
  username: string
  photo: string
}

const UserProfileCard = ({username,photo}:ProfileCardProps) => {
  return (
    <div className='flex flex-col items-center'>
        <Image 
              src={photo}
              alt='Profile photo'
              height={50}
              width={50}
              className='rounded-full'
              />

        <p className='text-xs break-all w-1/2'>
            {username}
         </p>
    </div>
  )
}

export default UserProfileCard