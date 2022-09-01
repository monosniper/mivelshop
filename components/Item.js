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

    return <>
        <Link href={'/items/'+item._id}>
            <div className="item-wrapper">
                <div
                    // onClick={() => setIsOpen(true)}
                    className={"item" + (item.long ? ' long' : '') + (store.activeItem ? (store.activeItem.id === item.id ? ' active' : '') : '')}
                    style={{backgroundImage: 'url("'+previews[item.uuid]+'")'}}
                    // className={'item'}
                >

                </div>
                <div className="item__caption">{item.name} - <span className="item__price">${item.price}</span></div>
            </div>
        </Link>

        <Modal
            open={isOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={() => setIsOpen(false)}
        >
            <Box
                className={'modal modal-item'}
                style={{backgroundImage: 'url("'+previews[item.uuid]+'")'}}
            >
                <Typography sx={{mb:3}} id="modal-modal-title" className={'modal-item__title'} variant="h4" component="h2">
                    {item.name} - <span className="item__price">${item.price}</span>
                </Typography>
                <Typography sx={{mb:3}} id="modal-modal-title" className={'modal-item__description'} component="p">
                    {item.description}
                </Typography>
                {store.loggedIn ? <div style={{textAlign:"center"}}>
                    <Button onClick={handleBasketClick} color={'white'} variant="contained">Добавить в корзину</Button>
                </div> : null}
            </Box>
        </Modal>
    </>;
};

export default observer(Item);