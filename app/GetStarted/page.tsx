import React from 'react'
import GetStarted from '../../components/GetStarted'
import { Suspense } from 'react';
export default async function page() {
  return (
    <>
    <Suspense fallback={<p>Loading...</p>}>
        <GetStarted />
      </Suspense>
    </>
  )
}
