import { Suspense } from 'react';
import React from 'react'
import PrivatePosts from './PrivatePosts';

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <PrivatePosts/>
    </Suspense>
  )
}
