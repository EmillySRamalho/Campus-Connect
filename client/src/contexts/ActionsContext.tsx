"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { loadPosts, likePosts, loadComments, removeLikePost, LoadMyPosts, GetSavedPosts } from "@/api/posts";
import { IComment, IPost } from "@/types";

interface IActionsContext {
    listPosts: (token: string) => Promise<any>
    loadingAction: boolean
    posts: IPost[] | null
    likeInPost: (user_id: number | undefined, post_id: number, token: string) => Promise<void>
    listComments: (post_id: number | undefined, token: string) => Promise<IComment[] | null>
    unlikePost: (user_id: number | undefined, post_id: number, token: string) => Promise<void>
    comment: IComment[] | null
    listMyPosts: (token: string) => Promise<any>
    myPosts: IPost[] | null
    postSaved: IPost[] | null
    listSavedPosts: (token: string) => Promise<void>
}

export const ActionContext = createContext<IActionsContext | undefined>(undefined);

export const ActionProvider = ({ children }: { children: React.ReactNode }) => {
    const [loadingAction, setLoadingAction] = useState<boolean>(false);
    const [posts, setPosts] = useState<IPost[] | null>(null);
    const [myPosts, setMyPosts] = useState<IPost[] | null>(null);
    const [postSaved, setPostSaved] = useState<IPost[] | null>(null);
    const [comment, setComments] = React.useState<IComment[] | null>(null);


    // Listar postagens do feed
    const listPosts = async (token: string) => {
        setLoadingAction(true);
        try {
            const res = await loadPosts(token);
            console.log(res);
            setPosts(res.data);
        }
        catch (err: any) {
            console.log(err);
        }
        finally {
            setLoadingAction(false);
        }
    }

    // Listar postagens do usuário
    const listMyPosts = async (token: string) => {
        setLoadingAction(true);
        try {
            const data = await LoadMyPosts(token);
            console.log(data)
            setMyPosts(data);
        }
        catch (err: any) {
            console.log(err);
        }
        finally {
            setLoadingAction(false);
        }
    }

    // Listar postagens salvas
    const listSavedPosts = async (token: string) => {
        try{
            const data = await GetSavedPosts(token);
            console.log(data);
            setPostSaved(data.posts);
        }
        catch(err: any){
            console.log(err);
        }
    }

    // Like nos posts
    const likeInPost = async (user_id: number | undefined, post_id: number, token: string) => {
        try {
            await likePosts(user_id, post_id, token);
            // atualiza o estado global
            setPosts(prev =>
                prev?.map(post =>
                    post.id === post_id
                        ? {
                            ...post,
                            liked_by_me: true,
                            likes_count: post.likes_count + 1
                        }
                        : post
                ) || null
            );

        }
        catch (err: any) {
            console.log(err);
        }
    }

    // Retirar like
    const unlikePost = async (user_id: number | undefined, post_id: number, token: string) => {
        try {
            await removeLikePost(user_id, post_id, token);
            setPosts(prev =>
                prev?.map(post =>
                    post.id === post_id
                        ? {
                            ...post,
                            liked_by_me: false,
                            likes_count: post.likes_count - 1
                        }
                        : post
                ) || null
            );
        }
        catch (err: any) {
            console.log(err);
        }
    }

    // Listagem de comentários de um post
    const listComments = async (post_id: number | undefined, token: string) => {
        try {
            const res = await loadComments(post_id, token);

            console.log(res);

            setComments(res)

            return res;
        }
        catch (err: any) {
            console.log(err)
        }
    }

    const contextValues = {
        listPosts,
        listMyPosts,
        myPosts,
        loadingAction,
        posts,
        likeInPost,
        listComments,
        unlikePost,
        comment,
        listSavedPosts,
        postSaved
    }

    return (
        <ActionContext.Provider value={contextValues}>
            {children}
        </ActionContext.Provider>
    )

}

export const useActionContext = () => {
    const context = useContext(ActionContext);
    if (context === undefined) {
        throw new Error("use o actionContext dentro de um ActionProvider"); 
    }
    return context;
};


