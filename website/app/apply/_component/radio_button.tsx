import React from 'react'
interface Choice {
  id: string
  title: string
}

interface RadioButtonProps {
  question: string
  choices: Choice[]
  selected: string
  onChange: (value: string) => void
  errorMessage: string | undefined
}

const RadioButton: React.FC<RadioButtonProps> = ({
  question,
  choices,
  selected,
  onChange,
  errorMessage
}: RadioButtonProps) => {
  return (
    <div className="sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 sm:py-6">
      <label className="block text-sm leading-6 text-gray-900 sm:pt-1.5 font-medium">
        {question}
      </label>
      <div className="mt-2 sm:col-span-1 sm:mt-0">
        {choices.map((choice) => (
          <div key={choice.id} className="flex items-center">
            <input
              id={choice.id}
              name={question}
              type="radio"
              checked={selected === choice.id}
              onChange={() => onChange(choice.id)}
              className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
            />
            <label
              htmlFor={choice.id}
              className="ml-3 block text-sm leading-6 text-gray-900"
            >
              {choice.title}
            </label>
          </div>
        ))}
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  )
}

export default RadioButton
