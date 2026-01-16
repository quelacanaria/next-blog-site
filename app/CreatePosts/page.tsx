import { Suspense } from 'react';
import CreatePost from './CreatePosts';

export default function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      < CreatePost/>
    </Suspense>
  )
}
