import { configureStore } from '@reduxjs/toolkit'
import postsSlice from './Slices/postSlice'
export const store = configureStore({
    reducer:{   
        posts: postsSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.dispatch>;