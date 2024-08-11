'use client'

import {
  ArrowUturnLeftIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import React, { use, useEffect } from 'react'
import { useMemo, useRef, useState } from 'react'
import TinderCard from 'react-tinder-card'
import LoadingPets from '../apply/_component/loading_pets'
import db from '../../lib/firestore'
import { serverTimestamp, doc, setDoc } from 'firebase/firestore'

interface Pet {
  id: string
  name: string
  sex: string
  age: string
  description: string
  images: string[]
  method: string
}

export default function ShowPet() {  
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([])
  const [currentIndex, setCurrentIndex] = useState(pets.length - 1)
  const [lastDirection, setLastDirection] = useState('')
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  function getQueryParam(paramName: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  const parseImages = (imagesString: string): string[] => {
    try {
      return JSON.parse(imagesString.replace(/'/g, '"'));
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
  };

  const fetchPets = async () => {
    const user_id = getQueryParam('user_id');
    const user_name = getQueryParam('user_name');
    const training = getQueryParam('training') || 'False';
    setLoading(true);
    fetch('/api/pets?user_id='+user_id+'&user_name='+user_name+'&training='+training)
      .then((res) => res.json())
      .then((data:any) => {
        const parsedPets = data.map((pet: { images: string }) => ({
          ...pet,
          images: parseImages(pet.images)
        }));
        console.log(parsedPets);
        setPets(parsedPets);
        setLoading(false);
      })
  }

  useEffect(() => {
    // update currentIndex to the last index of pets
    updateCurrentIndex(pets.length - 1)
  }, [pets])


  // fetch pets from server
  useEffect(() => {
    fetchPets();
  }, [])

  const childRefs = useMemo<React.RefObject<any>[]>(
    () =>
      Array(pets.length)
        .fill(0)
        .map((i) => React.createRef()),
    [pets]
  )

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < pets.length - 1

  const canSwipe = currentIndex >= 0


  // set last direction and decrease current index
  const swiped = async (direction: string, nameToDelete: string, method: string, index: number) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
    console.log(` ${nameToDelete} (${direction})`)
    // get the userId from the URL under userId
    const userId = getQueryParam('user_id')
    const docRef = doc(db, 'user_profile/'+userId+'/swipes', nameToDelete);
    await setDoc(docRef, {
      userId,
      petName: nameToDelete,
      method,
      direction,
      timestamp: serverTimestamp()
    }, { merge: true });
    if (index==0) {
      // fetch more pets
      fetchPets();
    }
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
    console.log(currentIndex, pets.length)
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

  if (loading) {
    return <LoadingPets />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 ">
      {pets.length > 0 && (
        <>
          <div className="relative isolate lg:w-[24rem] w-[20rem] mt-[8rem] mx-auto justify-center items-center">
            {pets.map((pet, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe overflow-hidden rounded-xl shadow-lg pb-4 bg-white"
                key={pet.name}
                preventSwipe={['up', 'down']}
                swipeRequirementType="position"
                swipeThreshold={200}
                onSwipe={(dir) => swiped(dir, pet.name, pet.method, index)}
                onCardLeftScreen={() => outOfFrame(pet.name, index)}
              >
                <div
                  style={{ backgroundImage: 'url(' + pet.images[0] + ')' }}
                  className="h-[22rem] lg:w-[24rem] w-[20rem] bg-cover bg-center"
                ></div>
                <div className="px-6 py-4 lg:w-[24rem] w-[20rem] bg-white">
                  <div className="font-light text-xs text-gray-700 mb-2">
                    via: {pet.method}
                  </div>
                  <div className="font-bold text-xl text-gray-700 mb-2">
                    {pet.name}, {pet.sex}, {pet.age}
                  </div>
                  <p className="text-gray-400 text-sm h-[13rem] break-words">
                    {pet.description}
                  </p>
                </div>
              </TinderCard>
            ))}
          </div>
          <div className="h-[42rem]"></div>
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
            <h2
              key={lastDirection}
              className="text-orange-500 text-xs text-center mt-2"
            >
              You swiped {lastDirection}
            </h2>
          ) : (
            <h2 className="text-gray-500 text-xs text-center mt-2">
              Swipe a card or press a button to get started.
            </h2>
          )}
        </>
      )}
    </div>
  )
}
