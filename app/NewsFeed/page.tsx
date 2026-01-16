import { Suspense } from 'react';
import React from 'react'
import NewsFeed from './NewFeed';

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      < NewsFeed/>
    </Suspense>
  )
}
