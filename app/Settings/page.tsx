import { Suspense } from 'react';
import Settings from './Settings';
export default async function page() {
  return (
    <>
    <Suspense fallback={<p>Loading...</p>}>
        <Settings/>
      </Suspense>
    </>
  )
}