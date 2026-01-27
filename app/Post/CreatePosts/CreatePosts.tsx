"use client";
import {FormEvent, useRef, useState} from 'react';
import { useAuth } from '@/AppContext/AuthContext';
import GetStarted from '../../../components/GetStarted';
import { useAddPost1Mutation} from '@/AppRedux/Slices/postApi';
import { UploadMultipleImage } from '@/lib/utils/UploadImage';

export default function CreatePost(){
    const [addPost1] = useAddPost1Mutation();
    const {user} = useAuth();
    const [pictures, setPictures] = useState<File[]>([]);
    const [preview, setPreview] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Public, setPublic] = useState('');
    const inputRef = useRef<HTMLInputElement|null>(null);

    const inputRemoveFileRef = (index:number) => {
        URL.revokeObjectURL(preview[index]);
        setPictures((prev) => prev.filter((_, i)=> i !== index));
        setPreview((prev)=> prev.filter((_, i)=> i !== index))
       
        if(inputRef.current){
            const dataTransfer=new DataTransfer();
            pictures.forEach((file)=>dataTransfer.items.add(file));
            inputRef.current.files=dataTransfer.files;
        }
        

    }
    const handleCreatePost = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{if(!title || !description || !user ) return;
            const image = await UploadMultipleImage(pictures, user.id)
            const author = user.user_metadata.name;
            await addPost1({title, description, user_id:user.id, Public, author, image});
            setTitle('');
            setDescription('');
            setPictures([]);
            setPreview([]);
        }catch(error:any){console.log(error.message)}
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
                    {preview.length === 0 ? '':
                        <div className='flex flex-wrap gap-2'>
                            {preview.map((image, i)=>(
                                <div className='relative w-fit'key={i}>
                                    <img  src={image} className='rounded block w-40' />
                                    <button onClick={()=>inputRemoveFileRef(i)} className='btn btn-xs btn-soft btn-neutral font-bold absolute top-0 right-0' type='button' >X</button>
                                </div>
                            ))}
                        </div>
                    }
                    <input 
                        onChange={(e) => {
                            setPictures(Array.from(e.target.files || []));
                            setPreview(Array.from(e.target.files || []).map(file=>URL.createObjectURL(file)))
                        }}
                        type="file" accept='image/*' multiple ref={inputRef}
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