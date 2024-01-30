export type CreateUserParams = {
    clerkId: string
    firstName: string
    username: string
    email: string
    photo: string
  }
  
  export type UpdateUserParams = {
    firstName: string
    username: string
    photo: string
    userLocation: string
    bio: string
  }
  
  // ====== EVENT PARAMS
  export type CreateTripParams = {
    userId: string
    trip: {
      title: string
      description: string
      tripCity: string
      tripCountry: string
      imageUrl: string
      startDate: Date
      endDate: Date
      categoryId: string
      url: string
    }
    path: string
  }
  
  export type UpdateTripParams = {
    userId: string
    event: {
      _id: string
      title: string
      imageUrl: string
      description: string
      tripCity: string
      tripCountry: string
      startDate: Date
      endDate: Date
      categoryId: string
      url: string
    }
    path: string
  }
  
  export type DeleteTripParams = {
    eventId: string
    path: string
  }
  
  export type GetAllTripsParams = {
    query: string
    category: string
    limit: number
    page: number
  }
  
  export type GetTripsByUserParams = {
    userId: string
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
    tripCity: string
    tripCountry: string
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
  
  export type GetOrdersByUserParams = {
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