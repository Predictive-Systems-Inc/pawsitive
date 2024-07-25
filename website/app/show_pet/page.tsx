'use client'

import {
  ArrowUturnLeftIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { useMemo, useRef, useState } from 'react'
import TinderCard from 'react-tinder-card'

interface Pet {
  id: string
  name: string
  gender: string
  age: string
  description: string
  images: string[]
}

export default function ShowPet() {
  const pets:Pet[] = [
    {
      id: '123',
      name: 'Alice',
      gender: 'F',
      age: '2',
      description:
        "Cuteness overload! if you have tons of time to spend playing with Alice with plenty of curiosity, and if you want to shower one with love and affection, adopt Alice. PAWS needs to find her a good home, a fur-ever home, not a home that loves her while she's little. When she's a full-grown cat and more mature, Alice will still be by your side through thick and thin.",
      images: [
        'https://paws.org.ph/wp-content/uploads/2023/05/SASHA-F-scaled-e1684201128741-1024x1024.jpg',
        'https://paws.org.ph/wp-content/uploads/2023/05/IMG_20230515_110402-scaled-e1684200687488-1024x1024.jpg'
      ]
    },
    {
      id: '456',
      name: 'Sasha',
      gender: 'F',
      age: '2',
      description:
        'Sasha was rescued with a litter of kittens a couple of years ago, and now it is time for her to find a fur-ever home that all cats desire. She is a tricolor tabby with plenty of fluffy white fur on her belly, making belly rubs so addictive if Sasha is game. Sasha is gentle, so she is very adoptable and there should be no personality issues to adjust to after adopting her. Still, a loving adopter or foster parent is wise to give Sasha time to get comfortable to their home; show Sasha your sweet side and give her treats to reinforce that you love her. The rewards to showing her love are worth the choice of letting her in your home sweet home. Welcome Sasha, and home sweet home will never be the same without her again.',
      images: [
        'https://paws.org.ph/wp-content/uploads/2023/05/SASHA-F-scaled-e1684201128741-1024x1024.jpg',
        'https://paws.org.ph/wp-content/uploads/2023/05/IMG_20230515_110402-scaled-e1684200687488-1024x1024.jpg'
      ]
    },
    {
      id: '678',
      name: 'Whitney',
      gender: 'M',
      age: '6',
      description:
        'Whitey may have looked like a healthy and happy stray dog, but in truth, he was in great pain. Someone attempted to castrate this poor boy by tying a rubber band tightly around his testicles. Thankfully, he received treatment at the shelter and is now fully recovered. Whitey is learning to trust humans again, and now he‚Äôs looking for a strong pack leader to give him a home.',
      images: [
        'https://paws.org.ph/wp-content/uploads/2023/03/Whitey-Before.jpg',
        'https://paws.org.ph/wp-content/uploads/2023/03/Adopt-Whitey-1024x1024.jpg'
      ]
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(pets.length - 1)
  const [lastDirection, setLastDirection] = useState("")
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo<React.RefObject<any>[]>(
    () =>
      Array(pets.length)
        .fill(0)
        .map((i) => React.createRef()),
    [pets]
  )

  const updateCurrentIndex = (val:number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < pets.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction: string, 
    nameToDelete: string, index: number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx]?.current?.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < pets.length) {
      await childRefs[currentIndex]?.current?.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 ">
      <div className="relative isolate lg:w-[24rem] w-[20rem] mt-[8rem] mx-auto justify-center items-center">
        {pets.map((pet, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe overflow-hidden rounded-xl shadow-lg pb-4 bg-white"
            key={pet.name}
            preventSwipe={['up', 'down']}
            swipeRequirementType="position"
            swipeThreshold={200}
            onSwipe={(dir) => swiped(dir, pet.name, index)}
            onCardLeftScreen={() => outOfFrame(pet.name, index)}
          >
            <div
              style={{ backgroundImage: 'url(' + pet.images[0] + ')' }}
              className="h-[22rem] lg:w-[24rem] w-[20rem] bg-cover bg-center"
            ></div>
            <div className="px-6 py-4 lg:w-[24rem] w-[20rem] bg-white">
              <div className="font-bold text-xl text-gray-700 mb-2">
                {pet.name}, {pet.gender}, {pet.age}
              </div>
              <p className="text-gray-400 text-sm h-[10rem] break-words">
                {pet.description}
              </p>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="h-[37rem]"></div>
      <div className="mx-auto flex justify-between items-center lg:w-[24rem] w-[20rem] mt-6">
        <button
          type="button"
          className="rounded-full bg-orange-400 p-2 ml-6 text-white shadow hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          onClick={() => swipe('left')}
        >
          <XMarkIcon aria-hidden="true" className="h-12 w-12" />
        </button>

        <button
          type="button"
          className="rounded-full bg-gray-200 p-2 text-black shadow hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          onClick={() => goBack()}
        >
          <ArrowUturnLeftIcon aria-hidden="true" className="h-8 w-8" />
        </button>
        <button
          type="button"
          className="rounded-full bg-orange-400 p-2 mr-6 text-white shadow hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          onClick={() => swipe('right')}
        >
          <HeartIcon aria-hidden="true" className="h-12 w-12" />
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="text-orange-500 text-xs text-center mt-2">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="text-gray-500 text-xs text-center mt-2">
          Swipe a card or press a button to get started.
        </h2>
      )}
    </div>
  )
}
