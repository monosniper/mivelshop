import React from 'react';
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import cookie from "js-cookie";
import Image from "next/image";
import AuthButton from "./AuthButton";
import User from "./User";
import {observer} from "mobx-react";
import store from "../store/store";

const Header = () => {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json();
    });
    if (!data) return <h1>Загрузка...</h1>;

    if (data.email) {
        store.setLoggedIn(true);
    }
    const logout = () => {
        cookie.remove('token');
        revalidate();
    }
    return (
        <div className="banner__header">
            <div className="basket">
                <div className="basket__icon"></div>
                <div className="basket__count">3</div>
            </div>
            {store.loggedIn ? <User user={data} logout={logout} /> : <AuthButton />}
        </div>
    );
};

export default observer(Header);