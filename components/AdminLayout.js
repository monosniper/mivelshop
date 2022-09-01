import React, {useEffect} from 'react';
import Head from "next/head";
import {Nav} from "./Nav";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import store from "../store/store";
import {useRouter} from "next/router";

const AdminLayout = ({ children }) => {
    const router = useRouter()
    const {data, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json();
    });

    useEffect(() => {
        if(data) {
            if (data.email) {
                store.setLoggedIn(true);
            }

            if(!data.isAdmin) {
                router.push('/')
            }
        }
    }, [data])

    if (!data) return <h1>Загрузка...</h1>;

    return (
        <>
            <Head>
                <title>Админ панель</title>

                {/* bootstrap css */}
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className="app-container bg-light">
                <Nav />

                <div className="container pt-4 pb-4">
                    {children}
                </div>
            </div>
        </>
    );
};

export default AdminLayout;