'use client'
import RadioButton from './_component/radio_button'
import Checkbox from './_component/checkbox'
import Image from 'next/image'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import db from '../../lib/firestore'
import { useState } from 'react'

export interface ApplicationFormData {
  fullname: string
  about: string
  houseType: string
  petsAllowed: string
  liveAlone: string
  childrenBelow12: string
  allergies: string
  familySupport: string
  hasPets: string
  currentPetTypes: string[]
  petsVaccinated: string
  petsNeutered: string
  // preferredPetType: string
  // preferredGender: string
  // preferredAge: string
  // preferredPersonality: string[]
}

interface Choice {
  id: string
  title: string
}

export default function ApplyNow() {

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullname: '',
    about: '',
    houseType: '',
    petsAllowed: '',
    liveAlone: '',
    childrenBelow12: '',
    allergies: '',
    familySupport: '',
    hasPets: '',
    currentPetTypes: [],
    petsVaccinated: '',
    petsNeutered: ''
    // preferredPetType: '',
    // preferredGender: '',
    // preferredAge: '',
    // preferredPersonality: []
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationFormData, string>>
  >({})

  const houseTypes = [
    { id: 'condo', title: 'Condo' },
    { id: 'townhouse', title: 'Townhouse' },
    { id: 'house with backyard', title: 'House with backyard' }
  ]
  const yesNo = [
    { id: 'yes', title: 'Yes' },
    { id: 'no', title: 'No' }
  ]

  const gender = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' },
    { id: 'any', title: 'Any' }
  ]

  const age = [
    { id: 'junior', title: 'Junior' },
    { id: 'senior', title: 'Senior' },
    { id: 'adult', title: 'Adult' },
    { id: 'any', title: 'Any' }
  ]

  const petType = [
    { id: 'pure_cat', title: 'Cat (Purebred)' },
    { id: 'mixed_cat', title: 'Cat (Mixed Breed)' },
    { id: 'pure_dog', title: 'Dog (Purebred)' },
    { id: 'mixed_dog', title: 'Dog (Mixed Breed)' },
    { id: 'other', title: 'Others' }
  ]

  const petTypeForAdoption = [
    { id: 'cat', title: 'Cat' },
    { id: 'dog', title: 'Dog' },
    { id: 'any', title: 'Any' }
  ]

  const personality = [
    { id: 'friendly', title: 'Friendly' },
    { id: 'shy', title: 'Shy' },
    { id: 'active', title: 'Active' },
    { id: 'laid-back', title: 'Laid-back' }
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (
    name: keyof ApplicationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (
    name: keyof ApplicationFormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const updatedValues = checked
        ? [...(prev[name] as string[]), value]
        : (prev[name] as string[]).filter((item) => item !== value)
      return { ...prev, [name]: updatedValues }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {}
    Object.entries(formData).forEach(([key, value]) => {
      // special handling of the following fields
      if (key === 'childrenBelow12' && formData.liveAlone === 'yes') 
        return
      if (key === 'familySupport' && formData.liveAlone === 'yes')
        return
      if (key === 'currentPetTypes' && formData.hasPets === 'no')
        return
      if (key === 'petsVaccinated' && formData.hasPets === 'no')
        return
      if (key === 'petsNeutered' && formData.hasPets === 'no')
        return
      if (Array.isArray(value)) {
        if (value.length === 0) {
          newErrors[key as keyof ApplicationFormData] = 'Please choose at least one option.'
        }
      } else if (!value) {
        newErrors[key as keyof ApplicationFormData] = 'This field is required.'
      }
    })
    console.log('Errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submitted')
    e.preventDefault()
    if (validateForm()) {
      try {
        console.log('Form data:', formData)
        const docRef = await addDoc(collection(db, 'user_profile'), {
          ...formData,
          timestamp: serverTimestamp()
        })
        console.log('Document written with ID: ', docRef.id)        
        // Redirect to adoption page
        window.location.href = '/show_pet?user_id=' + docRef.id + '&user_name=' + formData.fullname
      } catch (error) {
        console.error('Error adding document: ', error)
        // Show error message to user
      }
    }
  }

  return (
    <div className="container mx-auto mt-24 max-w-4xl px-4">
      <div className="relative isolate overflow-hidden bg-gray-900 py-18 sm:py-24 rounded-xl">
        <Image
          alt=""
          src="/adoption.jpg"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="mx-auto max-w-7xl p-4 lg:px-8 bg-black bg-opacity-40">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Pet Adoption Center
            </h2>
            <p className="mt-6 text-lg leading-8 text-white">
              Thank you for choosing to adopt. Every animal deserves a loving
              family, and your kindness makes a world of difference.
            </p>
          </div>
        </div>
      </div>
      <form
        className="bg-white shadow-sm border sm:rounded-xl md:col-span-2 p-8 mt-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Apply For Pet Adoption
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
              Dear Classmates and Friends, <br /><br/>
              Kindly answer this form truthfully based on your personal preference
              as we will be using this for analysis in our report. The data will be
              used for academic purposes only in MSDS - ML1.<br/><br/>
              Thank you!! <br/>
              - Learning Team 3

            </p>
            <p className="mt-10 max-w-2xl text-sm text-red-500 italic">
              Note: All fields are required.
            </p>
            <div className="mt-4 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Full Name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 sm:max-w-md">
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      placeholder="Full Name"
                      onChange={handleInputChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.fullname && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.fullname}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  About
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    onChange={handleInputChange}
                    defaultValue={''}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about yourself.
                  </p>
                  {errors.about && (
                    <p className="mt-2 text-sm text-red-600">{errors.about}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Living Cirscumstaces
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Please answer the following about your living condition:
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <RadioButton
                question="What type of place do you live in?"
                choices={houseTypes}
                selected={formData.houseType}
                onChange={(value) => handleRadioChange('houseType', value)}
                errorMessage={errors.houseType}
              />
              <RadioButton
                question="Are you allowed to keep pets?"
                choices={yesNo}
                selected={formData.petsAllowed}
                onChange={(value) => handleRadioChange('petsAllowed', value)}
                errorMessage={errors.petsAllowed}
              />
              {
                formData.petsAllowed === 'no' && (
                  <p className="text-sm text-red-600">
                    Warning, you may not qualify to own a pet, but please continue...
                  </p>
                )
              }
              <RadioButton
                question="Do you live alone?"
                choices={yesNo}
                selected={formData.liveAlone}
                onChange={(value) => handleRadioChange('liveAlone', value)}
                errorMessage={errors.liveAlone}
              />
              {formData.liveAlone === 'no' && (
                <RadioButton
                  question="Are there any children 12 year or below?"
                  choices={yesNo}
                  selected={formData.childrenBelow12}
                  onChange={(value) =>
                    handleRadioChange('childrenBelow12', value)
                  }
                  errorMessage={errors.childrenBelow12}
                />
              )}
              <RadioButton
                question="Does any member of your household have any known allergies to animals?"
                choices={yesNo}
                selected={formData.allergies}
                onChange={(value) => handleRadioChange('allergies', value)}
                errorMessage={errors.allergies}
              />
              {
                formData.allergies === 'yes' && (
                  <p className="text-sm text-red-600">
                    Warning, pets may trigger allergies for those who are sensitive. But please continue...
                  </p>
                )
              }
              {formData.liveAlone === 'no' && (
                <RadioButton
                  question="Do all members of the family support your decision to adopt a pet?"
                  choices={yesNo}
                  selected={formData.familySupport}
                  onChange={(value) =>
                    handleRadioChange('familySupport', value)
                  }
                  errorMessage={errors.familySupport}
                />
              )}
              {
                formData.familySupport === 'no' && (
                  <p className="text-sm text-red-600">
                    Please discuss this matter within the family first. But please continue...
                  </p>
                )
              }
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Pet Experience:
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Please tell us about your experience with pets:
            </p>

            <div className="mt-10 space-y-10 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <RadioButton
                question="Do you have any pets?"
                choices={yesNo}
                selected={formData.hasPets}
                onChange={(value) => handleRadioChange('hasPets', value)}
                errorMessage={errors.hasPets}
              />
              {formData.hasPets === 'yes' && (
                <>
                  <Checkbox
                    question="What kind of pets do you currently have?"
                    choices={petType}
                    selected={formData.currentPetTypes}
                    onChange={(value, checked) =>
                      handleCheckboxChange('currentPetTypes', value, checked)
                    }
                    errorMessage={errors.currentPetTypes}
                  />
                  <RadioButton
                    question="Is/are your pet/s vaccinated?"
                    choices={yesNo}
                    selected={formData.petsVaccinated}
                    onChange={(value) =>
                      handleRadioChange('petsVaccinated', value)
                    }
                    errorMessage={errors.petsVaccinated}
                  />
                  <RadioButton
                    question="Is/are your pet/s spayed/neutered?"
                    choices={yesNo}
                    selected={formData.petsNeutered}
                    onChange={(value) =>
                      handleRadioChange('petsNeutered', value)
                    }
                    errorMessage={errors.petsNeutered}
                  />
                </>
              )}
            </div>
          </div>
{/* 
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Pet Preference:
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Please tell us about the pet you like to adopt:
            </p>

            <div className="mt-10 space-y-10 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <RadioButton
                question="What kind of pet are you looking to adopt?"
                choices={petTypeForAdoption}
                selected={formData.preferredPetType}
                onChange={(value) =>
                  handleRadioChange('preferredPetType', value)
                }
                errorMessage={errors.preferredPetType}
              />
              <RadioButton
                question="Which gender would you prefer?"
                choices={gender}
                selected={formData.preferredGender}
                onChange={(value) =>
                  handleRadioChange('preferredGender', value)
                }
                errorMessage={errors.preferredGender}
              />
              <RadioButton
                question="What age of pet are you looking for?"
                choices={age}
                selected={formData.preferredAge}
                onChange={(value) => handleRadioChange('preferredAge', value)}
                errorMessage={errors.preferredAge}
              />
              <Checkbox
                question="What type of personality/energy do you like?"
                choices={personality}
                selected={formData.preferredPersonality}
                onChange={(value, checked) =>
                  handleCheckboxChange('preferredPersonality', value, checked)
                }
                errorMessage={errors.preferredPersonality}
              />
            </div>
          </div> */}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">

          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-600">Please fill in all required fields.</p>
          )}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
