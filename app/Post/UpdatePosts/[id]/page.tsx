"use client";
import { useAuth } from "@/AppContext/AuthContext";
import { useFetchPostsQuery, useUpdatePost1Mutation } from "@/AppRedux/Slices/postApi";
import Dropdown from "@/components/Dropdown";
import GetStarted from "@/components/GetStarted";
import { deleteImage, UploadImage } from "@/lib/utils/UploadImage";
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useState, useEffect } from "react";

export default function page(){
    const {id}=useParams();
    const {data:posts=[]}=useFetchPostsQuery();
    const post = posts.find((p:any)=> p.id === id)
    const {user} = useAuth();
    const router = useRouter();
    const [updatePost1]=useUpdatePost1Mutation();
    const [update, setUpdate] = useState<any|null>(null);
    const [picture, setPicture] = useState<File|null>(null);
    const [screen, setScreen] = useState<"edit"|"image">("edit");
    const [preview, setPreview] = useState<string|null>(null);

    if(!update)return setUpdate(post);
    const handleUpdatePost=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{await updatePost1(update);
            router.back();
        }catch(error:any){console.log(error.message)}
    }
    const handleUpdateImagePost = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{if(!user || picture===null)return;
            const image = await UploadImage(picture, user.id);
            if(update.image){await deleteImage(update.image)}
            await updatePost1({...update, image: image}) 
            router.back();
        }catch(error:any){console.log(error.message)}
    }
    return(<>
        {user ?(<>
            {screen === 'edit' && (
            <div className='w-full min-h-screen sticky top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center p-8'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={handleUpdatePost}>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'public'} checked={update.Public === 'public'} onChange={(e) => setUpdate({...update, Public: e.target.value,})} />
                            public</label>
                            <label htmlFor="" className='mr-2'>
                            <input type="radio" name="radio-1" className="radio mr-1" value={'private'} checked={update.Public === 'private'} onChange={(e) => setUpdate({...update, Public: e.target.value,})}/>
                            private</label>
                            <label>Image</label>
                            {post && update.image ? (
                                <>
                                <div className='w-full relative p-2 w-fit' >
                                    <img className="w-full" src={update.image} alt={update.image} />
                                    <div className='absolute top-2 right-2'>
                                    <Dropdown sizes="md" items={[
                                            { label: 'Delete Image', onClick:() => {router.push(`/Post/DeleteImage/${post.id}`)}},
                                            { label: 'Update Image', onClick:()=>{setScreen('image'); setUpdate(update)}}
                                        ]} buttonLabel={""} /></div>
                                </div>
                                </>
                                )
                                    :<button onClick={(e)=>{setScreen('image'); setUpdate(update)}} className='w-full btn btn-primary'>Add Image</button>}
                            <label htmlFor="">Title</label>
                            <input className='input w-full' type="text" value={update.title} onChange={(e) => setUpdate({...update, title: e.target.value,})} placeholder='title'/>
                            <label htmlFor="">Description</label>
                            <textarea className='textarea w-full' rows={3} value={update.description} onChange={(e) => setUpdate({...update, description: e.target.value,})} placeholder='description'/>
                            <div className="justify-end card-actions">
                                <button className='btn btn-error' type='button' onClick={() => {router.back()}} >Back</button>
                                <button className="btn btn-primary " >Update</button>
                            </div>
                        </form>
                    </div>
            </div>)}
            {screen === 'image' && (
                <div className='w-full min-h-screen sticky top-[0px] left-[0px] bg-neutral-100 flex justify-center items-center p-8'>
                  <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm ">
                        <form className="card-body" onSubmit={handleUpdateImagePost}>
                            <label>Image</label>
                            {preview === null ? update.image && (<img src={update.image} alt={update.image} />) : <img src={preview} /> }
                            <input onChange={(e)=>{
                                    if(e.target.files && e.target.files[0]){
                                        setPicture(e.target.files[0])
                                        setPreview(URL.createObjectURL(e.target.files[0]))
                                    }}}
                                   type='file' 
                                   accept='image/*'
                                   className="file-input file-input-bordered file-input-primary w-full file-input-sm" 
                            />
                            <button className='btn btn-error' onClick={() => {setScreen('edit')}} type='button' >Back</button>
                            <button className="btn btn-primary " >Update</button>
                        </form>
                    </div>
                </div>
            )}
            
            </>

        ): <GetStarted/>}
        </>
    )
}