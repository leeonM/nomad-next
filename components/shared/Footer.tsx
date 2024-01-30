import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='flex-center wrapper flex-between flex flex-col gap-4 p-5 yext-center sm:flex-row'>
        <Link href='/'>
          <Image 
          src='/assets/images/logo.svg'
          height={80}
          width={80}
          alt='Nomad logo'
          />
        </Link>
        <p>2024 Nomad. All Rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer