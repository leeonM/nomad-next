"use client"
import React, { useState, useTransition } from 'react'
import Comment from './Comment'
import { useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button';
import { createComment } from '@/lib/actions/trip.actions'



type CommentProps = {
  userId?: any
  parentId: string
}

const Comments = ({
  userId,
  parentId,
}: CommentProps) => {
  const [isPending,startTransition] = useTransition()
  const [text, setText] = useState("")
  const { isSignedIn } = useAuth();
  const path = usePathname()

  const create = async () => {
    try {
      await createComment({text,userId,parentId,path})
    } catch (error) {
      console.log(error)
    }
    setText("")
  }
    
  return (
    <div className='w-full flex mt-5 gap-2'>
       <input type="text" 
       value={text}
       className='w-full border-2 rounded-md p-2'
       onChange={(e)=>setText(e.target.value)}
       />
      {isSignedIn ?  <Button className={isSignedIn ? 'bg-primary-500' : 'bg-black'}
          onClick={()=>startTransition(create)}
       >
        {isPending ? "Loading..." :  'Comment'}
       </Button> : 
       <Link href={`/sign-in`}>
       <Button className='bg-primary-500'>
        Sign in to comment
       </Button>
       </Link>}
    </div>
  )
}

export default Comments