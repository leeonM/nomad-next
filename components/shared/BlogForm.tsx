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
import { blogFormSchema, tripFormSchema } from '@/lib/validator'
import { blogDefaultValues, tripDefaultValues } from '@/constants'
import Dropdown from './Dropdown'
import { Textarea } from '../ui/textarea'
import FileUploader from './FileUploader'
import Image from 'next/image';
import "react-datepicker/dist/react-datepicker.css";
import { useUploadThing } from '@/lib/uploadthing';
import { useParams, useRouter } from 'next/navigation';
import { IBlog } from '@/lib/database/models/blog.model';
import { createBlog, updateBlog } from '@/lib/actions/blog.actions';
 
type BlogFormProps = {
    userId: string
    type: 'Create' | 'Update'
    blog?: IBlog
    blogId?: string
}

const BlogForm = ({userId, type, blog, blogId}:BlogFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const router = useRouter()
    const initialValues = blog && type === 'Update' ? {
      ...blog,
    } : blogDefaultValues;

    const {startUpload} = useUploadThing('imageUploader')
    const form = useForm<z.infer<typeof blogFormSchema>>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: initialValues
      })
     
    async function onSubmit(values: z.infer<typeof blogFormSchema>) {

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
                    const newBlog = await createBlog({
                        blog: {
                            ...values,imageUrl:uploadedImageUrl
                        },
                        userId,
                        path: '/blog'
                    })

                    if (newBlog){
                        form.reset();
                        router.push(`/blog/${newBlog._id}`)
                    }
                    console.log(values)
            } catch (error) {
                console.log(error)
            }
        }

        if (type === 'Update'){

          if (!blogId){
            router.back()
            return;
          }
          try {
                  const updatedBlog = await updateBlog({
                    userId,
                      blog: {
                          ...values,imageUrl:uploadedImageUrl,
                          _id: blogId
                      },
                      path: `/blog/${blogId}`
                  })

                  if (updatedBlog){
                      form.reset();
                      router.push(`/trips/${updatedBlog._id}`)
                  }
          } catch (error) {
              console.log(error)
          }
      }
    
      }

  return (
    <>
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
                <Input placeholder="Blog title" {...field} 
                className='input-field'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="subTitle"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder="Blog subtitle" {...field} 
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
          name="text"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl className='h-72'>
                <Textarea 
                placeholder="Blog text" {...field} 
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


        <Button 
        type="submit" 
        size='lg' 
        disabled={form.formState.isSubmitting}
        className='button col-span-2 w-full'
        >
        {form.formState.isSubmitting ? 'Submitting' : `${type} Blog`}
        </Button>
      </form>
    </Form>
    </>
  )
}

export default BlogForm