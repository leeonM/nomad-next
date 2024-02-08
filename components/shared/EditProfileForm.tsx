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
import { tripFormSchema, userUpdateSchema } from '@/lib/validator'
import { tripDefaultValues } from '@/constants'
import Dropdown from './Dropdown'
import { Textarea } from '../ui/textarea'
import FileUploader from './FileUploader'
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUploadThing } from '@/lib/uploadthing';
import { useRouter } from 'next/navigation';
import { createTrip, updateTrip } from '@/lib/actions/trip.actions';
import { ITrip } from '@/lib/database/models/trip.model';
import { IUser } from '@/lib/database/models/user.model';
import { getUserByIdAndUpdate } from '@/lib/actions/user.actions';
 
type EditProfileFormProps = {
    userId: string
    user: IUser
}

const EditProfileForm = ({userId, user}:EditProfileFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const [city, setCity] = useState<string>('');
    const router = useRouter()
    const geosuggestEl = useRef<any>(null);
    const initialValues = user

    const GOOGLE_MAPS=`${process.env.GOOGLE_MAPS_API_KEY}`
    const {startUpload} = useUploadThing('imageUploader')
    const form = useForm<z.infer<typeof userUpdateSchema>>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: initialValues
      })
     
    async function onSubmit(values: z.infer<typeof userUpdateSchema>) {

        let uploadedImageUrl = values.photo

        if (files.length > 0) {
            const uploadedImages = await startUpload(files)


            if (!uploadedImages) {
                return
            }

            uploadedImageUrl = uploadedImages[0].url
        }

          if (!userId){
            router.back()
            return;
          }
          try {
                  const updatedUser = await getUserByIdAndUpdate({
                    userId,
                      user: {
                          ...values,photo:uploadedImageUrl,
                      },
                      path: `/profile/${values.username}`
                  })


                  if (updatedUser){
                      form.reset();
                      router.push(`/profile/${values.username}`)
                  }
          } catch (error) {
              console.log(error)
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
          name="username"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Username" 
                {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
              <Input placeholder="First name" 
              {...field} 
                className='input-field'
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
                placeholder="Bio" 
                {...field} 
                className='textarea rounded-2xl'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
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
          name="instagram"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Instagram url" 
                {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <FormField
          control={form.control}
          name="tiktok"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
              <Input placeholder="Tiktok url" 
              {...field} 
                className='input-field'
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
          name="linkedin"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Linkedin url" 
                {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
              <Input placeholder="Github url" 
              {...field} 
                className='input-field'
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
          name="facebook"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Facebook url" 
                {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
              <Input placeholder="What's your occupation" 
              {...field} 
                className='input-field'
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
          name="age"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
              <Input placeholder="How old are you" 
              {...field} 
                className='input-field'
                type='number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     <FormField
        control={form.control}
        name="userLocation"
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

        <Button 
        type="submit" 
        size='lg' 
        disabled={form.formState.isSubmitting}
        className='button col-span-2 w-full'
        >
        {form.formState.isSubmitting ? 'Submitting' : `Update user`}
        </Button>
      </form>
    </Form>
    </>
  )
}

export default EditProfileForm