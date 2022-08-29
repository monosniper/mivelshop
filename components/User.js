import React, {useState} from 'react';
import Image from "next/image";
import {Drawer, ListItemText, MenuItem, MenuList} from "@mui/material";
import {observer} from "mobx-react";
import store from "../store/store";

const User = ({ logout, user }) => {
    const [showProfile, setShowProfile] = useState(false)

    const handleLogout = () => {
        store.setLoggedIn(false)

        logout()
    }

    return (
        <React.Fragment>
            <div onClick={() => setShowProfile(true)} className="user">
                <div className="user__name">{user.name}</div>
                <div className="user__avatar">
                    <Image
                        src={'/../public/assets/img/avatar.png'}
                        width={60}
                        height={60}
                        alt={'Ваня'}
                    />
                </div>
            </div>

            <Drawer
                open={showProfile}
                className={'profile-drawer'}
                style={{width:'90%'}}
                onClose={() => setShowProfile(false)}
            >
                <MenuList>
                    <MenuItem>
                        <ListItemText style={{padding: '10px 30px', textAlign: 'center'}}>Мои заказы</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemText onClick={handleLogout} style={{padding: '10px 30px', textAlign: 'center'}}>Выйти</ListItemText>
                    </MenuItem>
                </MenuList>
            </Drawer>
        </React.Fragment>
    );
};

export default observer(User);