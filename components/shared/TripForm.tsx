"use client"
import Script from 'next/script';
import React, { useRef, useState } from 'react'
import Geosuggest from '@ubilabs/react-geosuggest';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { tripFormSchema } from '@/lib/validator'
import { tripDefaultValues } from '@/constants'
import Dropdown from './Dropdown'
import { Textarea } from '../ui/textarea'
import FileUploader from './FileUploader'
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUploadThing } from '@/lib/uploadthing';
import { useParams, useRouter } from 'next/navigation';
import { createTrip, updateTrip } from '@/lib/actions/trip.actions';
import { ITrip } from '@/lib/database/models/trip.model';
 
type TripFormProps = {
    userId: string
    type: 'Create' | 'Update'
    trip?: ITrip
    tripId?: string
    communityId?: string
}

const TripForm = ({userId, type, trip, tripId, communityId}:TripFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const [city, setCity] = useState<string>('');
    const router = useRouter()
    const geosuggestEl = useRef<any>(null);
    const initialValues = trip && type === 'Update' ? {
      ...trip,
      startDate: new Date(trip.startDate),
      endDate:  new Date(trip.endDate),
    } : tripDefaultValues;

    const GOOGLE_MAPS=`${process.env.GOOGLE_MAPS_API_KEY}`
    const {startUpload} = useUploadThing('imageUploader')
    const form = useForm<z.infer<typeof tripFormSchema>>({
        resolver: zodResolver(tripFormSchema),
        defaultValues: initialValues
      })
     
    async function onSubmit(values: z.infer<typeof tripFormSchema>) {

        let uploadedImageUrl = values.imageUrl

        if (files.length > 0) {
            const uploadedImages = await startUpload(files)


            if (!uploadedImages) {
                return
            }

            uploadedImageUrl = uploadedImages[0].url
        }

        if (type === 'Create'){
            try {
                    const newTrip = await createTrip({
                        trip: {
                            ...values,imageUrl:uploadedImageUrl
                        },
                        userId,
                        communityId,
                        path: '/profile'
                    })

                    if (newTrip){
                        form.reset();
                        router.push(`/trips/${newTrip._id}`)
                    }
                    console.log(values)
            } catch (error) {
                console.log(error)
            }
        }

        if (type === 'Update'){

          if (!tripId){
            router.back()
            return;
          }
          try {
                  const updatedTrip = await updateTrip({
                    userId,
                      trip: {
                          ...values,imageUrl:uploadedImageUrl,
                          _id: tripId
                      },
                      path: `/trips/${tripId}`
                  })

                  if (updatedTrip){
                      form.reset();
                      router.push(`/trips/${updatedTrip._id}`)
                  }
          } catch (error) {
              console.log(error)
          }
      }
    
      }

  return (
    <>
    <Script
        src={GOOGLE_MAPS}
        strategy="beforeInteractive"
      />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col gap-5"
      >

        <div className='flex flex-col gap-5 md:flex-row'>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Trip title" {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Dropdown 
                {...field} 
                onChangeHandler={field.onChange}
                value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl className='h-72'>
                <Textarea 
                placeholder="Description" {...field} 
                className='textarea rounded-2xl'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl className='h-72'>
                <FileUploader 
                onFieldChange={field.onChange}
                imageUrl={field.value}
                setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        
    

        <div className='flex flex-col gap-5 md:flex-row'>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='flex-center h-[54px] w-full overflow-hidden
                rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                    src='/assets/icons/calendar.svg' 
                    alt='calendar'
                    width={24}
                    height={24}
                    className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>Start Date:</p>
                    <DatePicker 
                    selected={field.value} 
                    onChange={(date: Date) => field.onChange(date)} 
                    dateFormat="MM/dd/yyyy"
                    wrapperClassName='datePicker'
                    />
                </div>
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='flex-center h-[54px] w-full overflow-hidden
                rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                    src='/assets/icons/calendar.svg' 
                    alt='calendar'
                    width={24}
                    height={24}
                    className='filter-grey'
                    />
                    <p className='ml-3 whitespace-nowrap text-grey-600'>End Date:</p>
                    <DatePicker 
                    selected={field.value} 
                    onChange={(date: Date) => field.onChange(date)} 
                    dateFormat="MM/dd/yyyy"
                    wrapperClassName='datePicker'
                    />
                </div>
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>


     <div className='flex flex-col gap-5 md:flex-row'>
     <FormField
        control={form.control}
        name="tripLocation"
        render={({ field }) => (
          <FormItem className='w-full'>
          <FormControl>
          <Geosuggest
            {...field}
            ref={geosuggestEl}
            onSuggestSelect={(suggest:any)=>{
              if (suggest) {
                field.onChange(suggest.label)
                setCity(suggest.label)
                if (geosuggestEl.current) {
                  geosuggestEl.current.updateSuggests()
                }
              }
            }}
            placeholder="Enter a city name"
            initialValue={field.value}
            inputClassName="input-field w-full outline-none z-10"
            
          />
          </FormControl>
         <FormMessage />
      </FormItem>
        )}
      />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <div className='flex-center h-[54px] w-full overflow-hidden
                rounded-full bg-grey-50 px-4 py-2'>
                    <Image 
                    src='/assets/icons/link.svg' 
                    alt='link'
                    width={24}
                    height={24}
                    />
                    <Input 
                    placeholder="URL for any events you are attending etc, your website etc." 
                    {...field}
                    className='input-field'
                    />
                </div>
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     </div>

        <Button 
        type="submit" 
        size='lg' 
        disabled={form.formState.isSubmitting}
        className='button col-span-2 w-full'
        >
        {form.formState.isSubmitting ? 'Submitting' : `${type} Trip`}
        </Button>
      </form>
    </Form>
    </>
  )
}

export default TripForm