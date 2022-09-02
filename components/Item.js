import React, {useState} from 'react';
import store from "../store/store";
import {observer} from "mobx-react";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import RegisterModal from "./RegisterModal";
import {Link} from "./Link";


const Item = ({ item, previews }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleBasketClick = () => {
        store.addBasket(item._id).then(() => {
            setIsOpen(false)
        })
    }
    console.log(previews)
    return <>
        {previews[item.uuid] ? <Link href={'/items/'+item._id}>
            <div className="item-wrapper">
                <div
                    // onClick={() => setIsOpen(true)}
                    className={"item" + (item.long ? ' long' : '') + (store.activeItem ? (store.activeItem.id === item.id ? ' active' : '') : '')}
                    style={{backgroundImage: 'url("'+previews[item.uuid][0]+'")'}}
                    // className={'item'}
                >

                </div>
                <div className="item__caption">{item.name} - <span className="item__price">${item.price}</span></div>
            </div>
        </Link> : null}
    </>;
};

export default observer(Item);