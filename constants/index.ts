export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Create Trip',
      route: '/trips/create',
    },
    {
      label: 'My Profile',
      route: '/profile',
    },
    {
      label: 'Create Community',
      route: '/community/create',
    },
  ]
  
  export const tripDefaultValues = {
    title: '',
    description: '',
    tripLocation: '',
    imageUrl: '',
    startDate: new Date(),
    endDate: new Date(),
    categoryId: '',
    url: '',
  }

  export const communityDefaultValues = {
    name: '',
    bio: '',
    communityLocation: '',
  }

  export const socialLinks = [
    {
      label: 'instagram',
      route: 'www.instagram.com',
      icon: '/assets/icons/instagram.svg'
    },
    {
      label: 'facebook',
      route: 'www.facebook.com',
      icon: '/assets/icons/facebook.svg'
    },
    {
      label: 'Linkedin',
      route: 'www.linkedin.com',
      icon: '/assets/icons/linkedin.svg'
    },
    {
      label: 'github',
      route: 'www.github.com',
      icon: '/assets/icons/github.svg'
    },
    {
      label: 'tiktok',
      route: 'www.tiktok.com',
      icon: '/assets/icons/tiktok.svg'
    },
  ]