import moment from 'moment';
import Link from 'next/link';
import React from 'react'

interface Props {
  text: string;
  username: string;
  userId: string;
  createdAt: Date;
}

const Comment = ({text, username, userId, createdAt}:Props) => {
  return (
    <div className='flex justify-between items-center p-2 border-b'>
    <div className='flex flex-col'>
      <Link href={`/profile/${username}`} className='cursor-pointer text-xs'>
      <p className='font-semibold text-primary-500 text-sm'>{username}</p>
      </Link>
    <p>{text}</p>
    <p className='text-xs'>{moment(createdAt).fromNow()}</p>
    </div>
    <div>
    </div>
    </div>
  )
}

export default Comment