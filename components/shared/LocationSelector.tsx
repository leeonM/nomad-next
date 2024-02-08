"use client"
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

type LocationProps = {
    value: {
        country: string,
        city: string,
    },
    onChangeHandler?:()=>void
}


const LocationSelector = ({value, onChangeHandler}:LocationProps) => {
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [location, setLocation] = useState({
        country: country,
        city: region
    })


    useEffect(() => {
      const finalLocation = () => {
        setLocation({country,city:region})
      }
      finalLocation()
    }, [country,region])
    

  return (
    <div>
      <CountryDropdown
        value={country}
        onChange={(val) => setCountry(val)} />
      <RegionDropdown
        country={country}
        value={region}
        onChange={(val) => setRegion(val)} />
    </div>
  )
}

export default LocationSelector