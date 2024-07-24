import React from 'react'

interface TextFieldProps {
  id: string
  label: string
}

const TextField: React.FC<TextFieldProps> = ({ id, label }) => {
  return (
    <div className="sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 sm:py-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {label}
      </label>
      <div className="mt-2 sm:col-span-1 sm:mt-0">
        <input
          id={id}
          name={id}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  )
}

export default TextField
