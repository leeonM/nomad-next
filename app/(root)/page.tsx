import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-grey-50 bg-dotted-pattern bg-contain py-5 md:py10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
               Meet like-minded people when traveling the globe
            </h1>
            <p className="p-regular-20 md:p-regular-24">
               Connecting Solo, couple, group travelers and expats around the globe,
               We're here to make your trip more special.
            </p>
            <Button className="bg-black button w-full sm:w-fit" asChild size='lg'>
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
            Search 
            Category Filter
          </div>
      </section>
    </>
  );
}
