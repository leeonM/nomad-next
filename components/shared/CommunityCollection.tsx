import React from 'react'
import Pagination from './Pagination'
import CommunityCard from './CommunityCard'
import { ICommunity } from '@/lib/database/models/community.model'

type CollectionProps = {
    userId: string,
    data: ICommunity[],
    emptyTitle: string,
    emptyStateSubtext: string,
    limit: number,
    page: number | string,
    totalPages?: number,
    urlParamName?: string,
}

const CommunityCollection = ({
    userId,
    data,
    emptyTitle,
    emptyStateSubtext,
    page,
    totalPages = 0,
    urlParamName,
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className='flex flex-col gap-10'>
            <ul className='grid w-full grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4 xl:gap-3'>
                {data.map((community)=>{

                 const isMember = data.map((item)=>item.members.some((member:any)=> member._id === userId))

                    return (
                        <li key={community._id}
                        className='flex'
                        >
                            <CommunityCard
                             community={community}
                            />
                        </li>
                    )
                })}
            </ul>

            {totalPages > 1 && (
              <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />
            )}
        </div>
      ): (
        <div className='flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center'>
            <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
            <p className='p-regular-14'>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}

export default CommunityCollection