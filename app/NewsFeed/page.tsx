import { Suspense } from 'react';
import Home from './NewsFeedClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Home />
    </Suspense>
  );
}
