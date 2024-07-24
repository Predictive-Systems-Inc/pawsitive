'use client'
import RadioButton from './_component/radio_button'
import TextField from './_component/text_field'
import Checkbox from './_component/checkbox'

export default function ApplyNow() {
  const houseTypes = [
    { id: 'condo', title: 'Condo' },
    { id: 'townhouse', title: 'Townhouse/Apartment' },
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

  return (
    <div className="container mx-auto mt-24 max-w-4xl px-4">
      <div className="relative isolate overflow-hidden bg-gray-900 py-18 sm:py-24 rounded-xl">
        <img
          alt=""
          src="adoption.jpg"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
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
      <form className="bg-white shadow-sm border sm:rounded-xl md:col-span-2 p-8 mt-4">
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Apply For Pet Adoption
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Please complete this form to ensure the safety and well-being of
              both you and the pet. <br />
              Your detailed responses help us make the best match possible.
            </p>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
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
                    defaultValue={''}
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about yourself.
                  </p>
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
              />
              <RadioButton
                question="Are you allowed to keep pets?"
                choices={yesNo}
              />
              <RadioButton question="Do you live alone?" choices={yesNo} />
              <RadioButton
                question="Are there any children 12 year or below?"
                choices={yesNo}
              />
              <TextField
                label="How many children are there (6 to 12 years old)?"
                id="children_5"
              />
              <RadioButton
                question="Does any member of your household have any known allergies to animals?"
                choices={yesNo}
              />
              <RadioButton
                question="Do all members of the family support your decision to adopt a pet?"
                choices={yesNo}
              />
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
              <RadioButton question="Do you have any pets?" choices={yesNo} />
              <Checkbox
                question="What kind of pets do you currently have?"
                choices={petType}
              />
              <RadioButton
                question="Is/are your pet/s vaccinated?"
                choices={yesNo}
              />
              <RadioButton
                question="Is/are your pet/s spayed/neutered?"
                choices={yesNo}
              />
            </div>
          </div>

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
              />
              <RadioButton
                question="Which gender would you prefer?"
                choices={gender}
              />
              <RadioButton
                question="What age of pet are you looking for?"
                choices={age}
              />
              <Checkbox
                question="What type of personality/energy do you like?"
                choices={personality}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={(e) => {
              e.preventDefault()
              location.href = '/show_pet'
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}
