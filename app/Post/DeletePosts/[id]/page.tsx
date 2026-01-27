"use client";
import { useAuth } from "@/AppContext/AuthContext";
import { useDeleteAllComments1Mutation, useDeletePost1Mutation, useFetchPostsQuery } from "@/AppRedux/Slices/postApi";
import { useParams } from "next/navigation"
import GetStarted from "@/components/GetStarted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { deleteAllImage, deleteImage } from "@/lib/utils/UploadImage";

export default function page(){
    const router = useRouter();
    const {id} = useParams();
    const {data: posts=[]}=useFetchPostsQuery();
    const post:any=posts.find((p:any) => p.id ===id);
    const [deletePost1]=useDeletePost1Mutation();
    const [deleteAllComments1]=useDeleteAllComments1Mutation();
    const {user}=useAuth();
    if(!post)return<p>loading</p>;

    const handleDeletePost = async(post:any)=>{
        try{if(post.id){await deleteAllImage(post.id)}
            await deleteAllComments1(post.id)
            if(post.image){await deleteImage(post.image)}
            await deletePost1(post.id)
            router.back();
        }catch(error:any){console.log(error.message)}
    }
    return(
        <>
        {user ? (
            <>
            <div className="flex flex-col gap-2 items-center p-0">
              <div className='hero bg-base-200 p-5'>
                <div className="card w-full max-w-sm sm:max-w-md bg-base-100 card-xl shadow-sm cursor-pointer" >
                  <div className="card-body">
                    <h3 className="text-error text-lg card-title">Are you sure you want to delete this post?</h3>
                    {post.image && (<img src={post.image} />)}
                    <h2 className="card-title">{post.title}</h2>
                    <p>{post.description}</p>
                    <div className="justify-end card-actions">
                      <button className='btn btn-primary' onClick={()=>router.back()}>Back</button>
                      <button className='btn btn-error' onClick={()=>handleDeletePost(post)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
        ):<GetStarted/>}
        </>
    )
}