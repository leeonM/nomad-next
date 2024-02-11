export type CreateUserParams = {
    clerkId: string
    firstName: string
    username: string
    email: string
    photo: string
  }
  
  export type UpdateUserParams = {
    userId: string
    user:{
    firstName: string
    username: string
    photo: string
    userLocation?: string
    bio?: string
    occupation?: string
    instagram?: string
    linkedin?: string
    facebook?: string
    github?: string
    tiktok?: string
    age?: string
  },
    path: string
  }

  export type UpdateClerkUserParams = {
    firstName: string
    username: string
    photo: string
    userLocation?: UserUnsafeMetadata
    bio?: UserUnsafeMetadata
    occupation?: UserUnsafeMetadata
    instagram?: UserUnsafeMetadata
    linkedin?: UserUnsafeMetadata
    facebook?: UserUnsafeMetadata
    github?: UserUnsafeMetadata
    tiktok?: UserUnsafeMetadata
    age?: UserUnsafeMetadata
  }

  export type GetUserByUsernameParams = {
    username: string
  }
  
  // ====== TRIP PARAMS
  export type CreateTripParams = {
    userId: string
    trip: {
      title: string
      description: string
      tripLocation: string
      imageUrl: string
      startDate: Date
      endDate: Date
      categoryId: string
      url: string
    }
    path: string
    communityId?: string
  }

  export type CreateCommunityParams = {
    userId: string
    community: {
      name: string,
      bio: string,
      communityLocation: string,
    },
    path:string
  }

  export type CreateBlogParams = {
    userId: string
    blog: {
      title: string
      subTitle: string
      text: string
      imageUrl: string
    }
    path: string
  }

  export type UpdateBlogParams = {
    userId: string
    blog: {
      _id: string
      title: string
      subTitle: string
      text: string
      imageUrl: string
    }
    path: string
  }
  
  export type UpdateTripParams = {
    userId: string
    trip: {
      _id: string
      title: string
      imageUrl: string
      description: string
      tripLocation: string
      startDate: Date
      endDate: Date
      categoryId: string
      url: string
    }
    path: string
  }

  export type UpdateCommunityParams = {
    userId: string
    community: {
      _id:string,
      name: string,
      bio: string,
      communityLocation: string,
    },
    path: string
  }
  
  export type DeleteTripParams = {
    tripId: string
    path: string
  }

  export type LikeTripParams = {
    id:string
    userId:string
    path:string
  }

  export type LikeCommunityParams = {
    id:string
    userId:string
    path:string
  }

  export type JoinCommunityParams = {
    id:string
    userId:string
    path:string
  }

  export type CreateCommentParams = {
    text: string
    userId: string
    parentId: string
    path: string
  }
  
  export type GetAllTripsParams = {
    query: string
    category: string
    limit: number
    page: number
  }


  export type GetAllCommunitiesParams = {
    communityQuery: string
    limit: number
    page: number
  }
  
  export type GetTripsByUserParams = {
    userId: string
    limit?: number
    page: number
  }

  export type GetTripsByCommunityParams = {
    communityId: string
    limit?: number
    page: number
  }
  
  export type GetRelatedTripsByCategoryParams = {
    categoryId: string
    tripId: string
    limit?: number
    page: number | string
  }
  
  export type Trip = {
    _id: string
    title: string
    description: string
    imageUrl: string
    tripLocation: string
    startDate: Date
    endDate: Date
    url: string
    organizer: {
      _id: string
      firstName: string
      lastName: string
    }
    category: {
      _id: string
      name: string
    }
    community: {
        _id: string
        name: string
      }
    likes: string[],
    comments: string[],
  }
  
  // ====== CATEGORY PARAMS
  export type CreateCategoryParams = {
    categoryName: string
  }
  
  // ====== ORDER PARAMS
  export type CheckoutOrderParams = {
    eventTitle: string
    eventId: string
    price: string
    isFree: boolean
    buyerId: string
  }
  
  export type CreateOrderParams = {
    stripeId: string
    eventId: string
    buyerId: string
    totalAmount: string
    createdAt: Date
  }
  
  export type GetOrdersByEventParams = {
    eventId: string
    searchString: string
  }
  
  export type GetLikedByUserParams = {
    userId: string | null
    limit?: number
    page: string | number | null
  }
  
  // ====== URL QUERY PARAMS
  export type UrlQueryParams = {
    params: string
    key: string
    value: string | null
  }
  
  export type RemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
  }
  
  export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

  export type CommunityParamProps = {
    params: {id:string}
    searchParams: { [key: string]: string | string[] | undefined }
  }

  export type SearchUsernameParamProps = {
    params: { username: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }