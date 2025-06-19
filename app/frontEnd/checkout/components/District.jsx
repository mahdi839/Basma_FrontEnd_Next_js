"use client"; 
import React from 'react'
import Select from 'react-select';
export default function District({ value, onChange, required = false }) {
    const bdDistricts = [
        { value: "dhaka", label: "Dhaka" },
        { value: "faridpur", label: "Faridpur" },
        { value: "gazipur", label: "Gazipur" },
        { value: "gopalganj", label: "Gopalganj" },
        { value: "kishoreganj", label: "Kishoreganj" },
        { value: "madaripur", label: "Madaripur" },
        { value: "manikganj", label: "Manikganj" },
        { value: "munshiganj", label: "Munshiganj" },
        { value: "narayanganj", label: "Narayanganj" },
        { value: "narsingdi", label: "Narsingdi" },
        { value: "rajbari", label: "Rajbari" },
        { value: "shariatpur", label: "Shariatpur" },
        { value: "tangail", label: "Tangail" },
        { value: "bandarban", label: "Bandarban" },
        { value: "brahmanbaria", label: "Brahmanbaria" },
        { value: "chandpur", label: "Chandpur" },
        { value: "chittagong", label: "Chittagong" },
        { value: "comilla", label: "Comilla" },
        { value: "cox's bazar", label: "Cox's Bazar" },
        { value: "feni", label: "Feni" },
        { value: "khagrachhari", label: "Khagrachhari" },
        { value: "lakshmipur", label: "Lakshmipur" },
        { value: "noakhali", label: "Noakhali" },
        { value: "rangamati", label: "Rangamati" },
        { value: "bagerhat", label: "Bagerhat" },
        { value: "chuadanga", label: "Chuadanga" },
        { value: "jessore", label: "Jessore" },
        { value: "jhenaidah", label: "Jhenaidah" },
        { value: "khulna", label: "Khulna" },
        { value: "kushtia", label: "Kushtia" },
        { value: "magura", label: "Magura" },
        { value: "meherpur", label: "Meherpur" },
        { value: "narail", label: "Narail" },
        { value: "satkhira", label: "Satkhira" },
        { value: "bogra", label: "Bogra" },
        { value: "joypurhat", label: "Joypurhat" },
        { value: "naogaon", label: "Naogaon" },
        { value: "natore", label: "Natore" },
        { value: "chapainawabganj", label: "Chapainawabganj" },
        { value: "pabna", label: "Pabna" },
        { value: "rajshahi", label: "Rajshahi" },
        { value: "sirajganj", label: "Sirajganj" },
        { value: "dinajpur", label: "Dinajpur" },
        { value: "gaibandha", label: "Gaibandha" },
        { value: "kurigram", label: "Kurigram" },
        { value: "lalmonirhat", label: "Lalmonirhat" },
        { value: "nilphamari", label: "Nilphamari" },
        { value: "panchagarh", label: "Panchagarh" },
        { value: "rangpur", label: "Rangpur" },
        { value: "thakurgaon", label: "Thakurgaon" },
        { value: "habiganj", label: "Habiganj" },
        { value: "moulvibazar", label: "Moulvibazar" },
        { value: "sunamganj", label: "Sunamganj" },
        { value: "sylhet", label: "Sylhet" },
        { value: "barguna", label: "Barguna" },
        { value: "barishal", label: "Barishal" },
        { value: "bhola", label: "Bhola" },
        { value: "jhalokati", label: "Jhalokati" },
        { value: "patuakhali", label: "Patuakhali" },
        { value: "pirojpur", label: "Pirojpur" },
        { value: "jamalpur", label: "Jamalpur" },
        { value: "mymensingh", label: "Mymensingh" },
        { value: "netrokona", label: "Netrokona" },
        { value: "sherpur", label: "Sherpur" }
      ];
  return (
    <Select
    options={bdDistricts}
    value={bdDistricts.find(option => option.value === value)}
    onChange={onChange}
    placeholder="Search or select district..."
    isSearchable
    required={required}
    styles={{
      control: (base) => ({
        ...base,
        padding: '4px',
        border: '1px solid #dee2e6',
        borderRadius: '0.375rem',
        minHeight: 'calc(1.5em + 0.75rem + 2px)'
      })
    }}
    className="basic-multi-select"
    classNamePrefix="select"
  />
  )
}
