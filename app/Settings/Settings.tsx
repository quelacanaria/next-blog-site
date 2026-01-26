"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '@/components/GetStarted';
export default function Settings() {
    const router = useRouter();
    const {user} = useAuth();
 return (
        <>
        {user ? (
            <div className="hero bg-base-200 p-4 sm:p-5 min-h-150" >
                <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-base sm:text-lg">{user.user_metadata.name}</h2>
                    <p className="text-sm sm:text-base">{user.email}</p>
                      <button className='btn btn-primary' onClick={() => router.replace('/PrivatePosts')}>Manage Private Posts</button>
                    <div className="justify-end card-actions">
                    </div>
                </div>
                </div>
            </div>): <GetStarted/>}
        </>
  )
}
