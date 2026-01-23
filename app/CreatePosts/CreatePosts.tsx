"use client";
import {FormEvent, useEffect, useState} from 'react';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '../../components/GetStarted';
import { useAddPost1Mutation} from '@/AppRedux/Slices/postApi';
import { supabase } from '@/lib/supabase/client';

export default function CreatePost(){
    const [addPost1] = useAddPost1Mutation();
    const {user} = useAuth();
    const [user_id, setUser_id] = useState<string|null>(null);
    const [picture, setPicture] = useState<File|null>(null);
    const [preview, setPreview] = useState<string|null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Public, setPublic] = useState('');
    useEffect(() => {
        if(!user)return;
        setUser_id(user.id);
    })
    const uploadImage = async(file: File|null, userId: string) => {
        if(!file)return null;

        const ext = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${ext}`;

        const {error} = await supabase.storage
                                .from('postsImages')
                                .upload(fileName, file);
        if(error) throw error;
        const {data} = supabase.storage.from('postsImages')
                        .getPublicUrl(fileName)
        return data.publicUrl;
    }

    const handleCreatePost = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!title || !description || !user || !user_id) return;
        const image = await uploadImage(picture, user_id)
        const author = user.user_metadata.name;
        console.log(author)
        console.log(image)
        await addPost1({title, description, user_id, Public, author, image});
        setTitle('');
        setDescription('');
        setPicture(null);
        setPreview(null);
    }
    return(
        <>
        {user ? ( 
            <>
          <div className="hero bg-base-200 min-h-screen p-8">
            <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm">
                <form className="card-body" onSubmit={handleCreatePost}>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" value={Public} onChange={() => setPublic('public')} />
                    public</label>
                    <label htmlFor="" className='mr-2'>
                    <input type="radio" name="radio-1" className="radio mr-1" value={Public} onChange={() => setPublic('private')}/>
                    private</label>
                    <label htmlFor="">Image</label>
                    {preview === null ? '': <img src={preview} />}
                    <input 
                        onChange={(e) => {
                            if(e.target.files && e.target.files[0]){
                                setPicture(e.target.files[0])
                                setPreview(URL.createObjectURL(e.target.files[0]))
                            }
                        }}
                        type="file" 
                        accept='image/*' 
                        className="file-input file-input-bordered file-input-primary w-full file-input-sm" 
                    />
                    <label htmlFor="">Title</label>
                    <input className='input w-full' type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder='title'/>
                    <label htmlFor="">Description</label>
                    <textarea className='textarea w-full' rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder='description'/>
                    <div className="justify-end card-actions">
                    <button className="btn btn-primary w-full" >Create</button>
                    </div>
                </form>
            </div>
          </div>
          </>
          ): (<GetStarted/>)}
           
        </>
    )
}