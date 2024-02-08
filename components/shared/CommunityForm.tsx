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
import { communityFormSchema } from '@/lib/validator'
import { communityDefaultValues } from '@/constants'
import { Textarea } from '../ui/textarea'
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import { ICommunity } from '@/lib/database/models/community.model';
import { createCommunity, updateCommunityInfo } from '@/lib/actions/community.actions';
 
type CommunityFormProps = {
    userId: string
    type: 'Create' | 'Update'
    community?: ICommunity
    communityId?: string
}

const CommunityForm = ({userId, type, community, communityId}:CommunityFormProps) => {
    const [city, setCity] = useState<string>('');
    const router = useRouter()
    const geosuggestEl = useRef<any>(null);
    const initialValues = community && type === 'Update' ? {
      ...community,
    } : communityDefaultValues;

    const GOOGLE_MAPS=`${process.env.GOOGLE_MAPS_API_KEY}`
    // const {startUpload} = useUploadThing('imageUploader')
    const form = useForm<z.infer<typeof communityFormSchema>>({
        resolver: zodResolver(communityFormSchema),
        defaultValues: initialValues
      })
     
    async function onSubmit(values: z.infer<typeof communityFormSchema>) {

        if (type === 'Create'){
            try {
                    const newCommunity = await createCommunity({
                        community: {
                            ...values
                        },
                        userId,
                        path: `/profile`
                    
                    })

                    if (newCommunity){
                        form.reset();
                        router.push(`/community/${newCommunity._id}`)
                    }
                    console.log(values)
            } catch (error) {
                console.log(error)
            }
        }

        if (type === 'Update'){

          if (!communityId){
            router.back()
            return;
          }
          try {
                  const updatedCommunity = await updateCommunityInfo({
                    userId,
                      community: {
                          ...values,
                          _id: communityId
                      },
                      path: `/community/${communityId}`
                  })

                  if (updatedCommunity){
                      form.reset();
                      router.push(`/community/${updatedCommunity._id}`)
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
          name="name"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Community name" {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

    <FormField
        control={form.control}
        name="communityLocation"
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

        </div>


     <div className='flex flex-col gap-5 md:flex-row'>
     <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl className='h-72'>
                <Textarea 
                placeholder="Community bio" {...field} 
                className='textarea rounded-2xl'
                />
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

export default CommunityForm