"use client"
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const NotesComponent = () => {
  const getData = useQuery(api.notes.getNotes)
  console.log(getData, "getdata")
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getData?.map((data, idx) => {
          return (
            <Card key={data._id}>
              <CardHeader>
                <CardTitle>{data.title || 'Untitled Note'}</CardTitle>
                <CardDescription>
                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{data?._creationTime || data?.title || 'No content'}</p>
              </CardContent>
              <CardFooter className="text-xs text-gray-400">
                ID: {data._id}
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {(!getData || getData.length === 0) && (
        <p className="text-center text-gray-500 mt-8">No notes found</p>
      )}
    </div>
  )
}

export default NotesComponent