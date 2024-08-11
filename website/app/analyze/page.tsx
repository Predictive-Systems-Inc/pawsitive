'use client'

import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import db from '../../lib/firestore'

export default function AnalyzeUser() {
  const [users, setUsers] = useState<DocumentData[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [swipes, setSwipes] = useState<DocumentData[]>([])
  const [similarUsers, setSimilarUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'user_profile'), orderBy('fullname'))
      const querySnapshot = await getDocs(q)
      const userData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id // Include the document ID as uid
      }))
      setUsers(userData)
      console.log('User data: ', userData)
    } catch (error) {
      console.error('Error retrieving documents: ', error)
    }
  }

  const fetchUserSwipes = async (userId: string) => {
    if (!userId) {
      return
    }
    try {
      const q = query(
        collection(db, 'user_profile', userId, 'swipes'),
        orderBy('timestamp', 'asc')
      )
      const querySnapshot = await getDocs(q)
      const swipeData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setSwipes(swipeData)
      console.log('Swipe data: ', swipeData)
    } catch (error) {
      console.error('Error retrieving documents: ', error)
    }
  }

  const fetchUserSimilarity = async (userId: string) => {
    // if user_id is empty, return
    if (!userId) {
      return
    }
    fetch('/api/analyze?user_id=' + userId)
      .then((res) => res.json())
      .then((data) => {
        console.log('Similarity data: ', data)
        if (data.length === 0) {
          setSimilarUsers([])
          return
        }
        // parse data as json
        data = JSON.parse(data)
        const similar: any[] = []
        Object.keys(data).forEach((key) => {
          const value = data[key]
          // find userid in users
          const user = users.find((user) => user.uid === key) ?? {
            fullname: 'Not Found'
          }
          similar.push({
            uid: key,
            name: user['fullname'],
            similarity: value.similarity,
            swipes: value.swipes
          })
        })
        console.log('Similar users: ', similar)
        setSimilarUsers(similar)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value)
  }

  useEffect(() => {
    console.log('Selected user: ', selectedUser)
    // Fetch user swipes based on selected
    fetchUserSwipes(selectedUser)
    // Fetch user similarity based on selected
    fetchUserSimilarity(selectedUser)
  }, [selectedUser])

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="container mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            User Analysis
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            <select onChange={handleChange}>
              {users.map((user, index) => (
                <option key={user.uid} value={user.uid}>
                  {user.fullname}
                </option>
              ))}
            </select>
          </p>
        </div>
      </div>
      <h1 className="text-base font-semibold mt-8 mb-2 leading-6 text-gray-900">
        Similar Users
      </h1>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {similarUsers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-300 border">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap p-2 border text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Similar User
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap p-2 border text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Similarity
                    </th>
                    {Object.keys(similarUsers[0].swipes).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="whitespace-nowrap p-2 border text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {similarUsers.map((user, index) => (
                    <tr key={user.uid}>
                      <td className="whitespace-nowrap py-2 text-sm text-gray-500 sm:pl-0 text-center">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap py-2 text-sm text-gray-500 sm:pl-0 text-center">
                        {user.similarity === "NaN"? NaN: user.similarity.toFixed(2)}
                      </td>
                      {Object.keys(user.swipes).map((key) => (
                        <td
                          key={key}
                          className={`whitespace-nowrap py-2 text-sm text-gray-500 sm:pl-0 text-center ${
                            user.swipes[key] === 'NaN'
                              ? ''
                              : user.swipes[key] === 1
                              ? 'bg-green-200'
                              : 'bg-red-200'
                          }`}
                        >
                          {user.swipes[key] === 'NaN' ? '---' : user.swipes[key] === 1 ? 'Yes' : 'No'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500">
                No similar users found.
              </div>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-base font-semibold mt-8 leading-6 text-gray-900">
        Swipe Trend
      </h1>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 max-w-2xl">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Pet Name
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Method
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Yes / No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {swipes.map((swipe, index) => (
                  <tr key={swipe.uid}>
                    <td className="whitespace-nowrap py-2 text-sm text-gray-500 sm:pl-0">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm  text-gray-900">
                      {swipe.petName}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm  text-gray-900">
                      {swipe.method}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 font-medium">
                      {swipe.direction === 'right' ? 'Yes' : 'No'}
                    </td>{' '}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
