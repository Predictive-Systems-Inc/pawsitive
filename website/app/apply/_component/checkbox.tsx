import React from 'react'

interface Choice {
  id: string
  title: string
}

interface CheckboxProps {
  question: string
  choices: Choice[]
}

const Checkbox: React.FC<CheckboxProps> = ({ question, choices }) => {
  return (
    <fieldset>
      <legend className="sr-only">{question}</legend>
      <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:py-6">
        <div
          aria-hidden="true"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          {question}
        </div>
        <div className="mt-4 sm:col-span-1 sm:mt-0">
          <div className="max-w-lg ">
            {choices.map((choice) => (
              <div key={choice.id} className="relative flex gap-x-3">
                <div className="flex items-center">
                  <input
                    id={choice.id}
                    name={choice.id}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor={choice.id}
                    className=" text-gray-900"
                  >
                    {choice.title}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default Checkbox;