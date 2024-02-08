import { NextResponse } from 'next/server';
import { clerkClient } from "@clerk/nextjs";
 
export async function POST(req:any) {
    const {id, image_url, first_name, username, userLocation, bio, occupation,instagram,linkedin,facebook,github,tiktok,age} = await req.json()

    await clerkClient.users.updateUserMetadata(id, {
      unsafeMetadata: {
        firstName: first_name,
        username: username!,
        photo: image_url,
        userLocation: userLocation!,
        bio: bio!,
        occupation: occupation!,
        instagram: instagram!,
        linkedin: linkedin!,
        facebook: facebook!,
        github: github!,
        tiktok: tiktok!,
      age: age!,
      }
    })
  return NextResponse.json({ success: true });
}