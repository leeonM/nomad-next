import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import CommunityCard from "@/components/shared/CommunityCard";
import CommunityCollection from "@/components/shared/CommunityCollection";
import Search from "@/components/shared/Search";
import SearchCommunity from "@/components/shared/SearchCommunity";
import SearchLocation from "@/components/shared/SearchLocation";
import { Button } from "@/components/ui/button";
import { getAllCommunities } from "@/lib/actions/community.actions";
import { getAllTrips, getAllTripsByLocation } from "@/lib/actions/trip.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home({searchParams}:SearchParamProps) {
  const page = Number(searchParams?.page) || 1
  const searchText = (searchParams?.query as string) || ''
  const category = (searchParams?.category as string) || ''
  const community = (searchParams?.communityQuery as string) || ''
  const communities = await getAllCommunities({
    communityQuery:community,
    page,
    limit:6
  })
  const trips = await getAllTrips({
    query:searchText,
    category,
    page,
    limit:6,
  })

  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string
  return (
    <>
      <section className="bg-grey-50 bg-dotted-pattern bg-contain py-5 md:py10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Find your travel tribe around the world
            </h1>
            <p className="p-regular-20 md:p-regular-24">
            Uniting solo explorers, couples, groups, and expatriates across the planet to 
            add a unique touch to your journey.
            </p>
            <Button className="bg-primary-500 button w-full sm:w-fit" asChild size='lg'>
              <Link href="#trips">
                Explore now
              </Link>
            </Button>
          </div>
          {/* <Image 
          src='/assets/images/hero.png'
          alt="hero"
          width={1000}
          height={1000}
          className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh] rounded-md"
          /> */}
        </div>
      </section>

      <section id="trips"
      className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
          <h2 className="h2-bold">Trusted by <br /> Thousands of travelers</h2>
          <div className="flex w-full flex-col gap-5 md:flex-row">
            <Search />
            <CategoryFilter />
          </div>



          <Collection 
          data={trips?.data}
          emptyTitle="No Trips Found"
          emptyStateSubtext="Why don't you add a trip"
          limit={6}
          page={page}
          totalPages={trips?.totalPages}
          userId={userId}
          />
      </section>

      <section id='communities' className='wrapper my-8 flex flex-col gap-8 md:gap-12'>
      <h2 className='h2-bold'>Communities</h2>

          <div className="flex w-full md:w-1/2 flex-col gap-5 md:flex-row">
            <SearchCommunity />
          </div>

          {/* trips */}
          <CommunityCollection
           data={communities?.data}
           emptyTitle="No Communities Found"
           emptyStateSubtext="Why don't you add a community"
           limit={6}
           page={page}
           totalPages={communities?.totalPages}
           userId={userId}
          />
    </section>
    </>
  );
}
