"use client";
import React, { ReactNode} from 'react'
import { FormEvent, useState } from "react";
import { useAuth } from '@/AppContext/AuthContext';
import { useRouter } from 'next/navigation';
type Mode = 'signup'|'signin';
export default function GetStarted() {
    const { user, signIn, signUp, status, setStatus } = useAuth();
    const [mode, setMode] = useState<Mode>('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = mode === 'signin' ? signIn(email, password) : signUp(name, email, password);
        setStatus(await response);
        setEmail('');
        setPassword('');
    }
  return (
    <>
            {!user && ( <>
            {mode === 'signin' && (
            <div className="hero bg-base-200 min-h-140 ">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        {status &&(status)} 
                        <form className="fieldset" onSubmit={handleSubmit} >
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)} />
                        <label className="label">Password</label>
                        <input type="password" className="input" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Password" />
                        <div><a className="link link-hover" onClick={() => setMode('signup')} >Create Account?</a></div>
                        <button className="btn btn-primary mt-4">Login</button>
                        </form>
                    </div>
                </div>
            </div>   )}
            {mode === 'signup' &&(
            <div className="hero bg-base-200 min-h-140">
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    {status &&(status)} 
                    <form className="fieldset" onSubmit={handleSubmit}>
                    <label className="label">Name</label>
                    <input type="text" className="input" placeholder="Name" value={name} onChange={event=>setName(event.target.value)} required/>
                    <label className="label">Email</label>
                    <input type="email" className="input" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)}/>
                    <label className="label">Password</label>
                    <input type="password" className="input" placeholder="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                    <div><a className="link link-hover" onClick={() => setMode('signin')}>Login?</a></div>
                    <button className="btn btn-primary mt-4">Create</button>
                    </form>
                </div>
                </div>
            </div>)}   
            </>)}
            {user && (
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Welcome {user && user.user_metadata.name }</h1>
                    <p className="py-6">
                        To empower individuals to share their stories, ideas, and expertise with the world by providing an intuitive, accessible, and engaging platform for blogging.
                    </p>
                    <button className="btn btn-primary" onClick={() => router.replace('/CreatePosts')}>Create Post</button>
                    </div>
                </div>
            </div>)}
                  
    </>
  )
}

