import React from 'react'

const LoadingPets = () => {
  return (
    <div className="flex justify-center mt-40 h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mr-4"></div>
      <div className="text-leftr">
        <h1 className="text-2xl text-gray-700">Finding pets...</h1>
        <p className="text-gray-500">Looking for the best pet recommendation for you.</p>
      </div>
    </div>
  )
}

export default LoadingPets
