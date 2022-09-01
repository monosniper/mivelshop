import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {
    Box,
    Button,
    Drawer,
    IconButton,
    ListItemText,
    MenuItem,
    MenuList, Modal,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Link} from "./Link";
import store from "../store/store";
import {observer} from "mobx-react";
import usePreviews from "../hooks/usePreviews";
import {AiFillDelete} from "react-icons/ai";

function BasketItem({previews, item}) {
    const handleDelete = () => {
        store.removeBasket(item._id)
    }

    return <div className="basket-item" style={{backgroundImage: 'url("'+previews[item.uuid]+'")'}}>
        <IconButton className={'basket-del-btn'} onClick={handleDelete} aria-label="delete">
            <AiFillDelete />
        </IconButton>
    </div>;
}

function BasketFooter() {
    const [isOpen, setIsOpen] = useState(false)
    const [fio, setFio] = useState('')
    const [address, setAddress] = useState('')
    const [post, setPost] = useState('')
    const [phone, setPhone] = useState('')

    const handleSubmit = () => {
        store.createOrder({
            fio,
            address,
            post,
            phone,
        }).then(rs => {
            if(rs.ok) {
                store.setBasket([])
                setIsOpen(false)
                store.setIsOrdersDrawerOpen(true)
                store.requestOrders()
            }
        })
    }

    return <>
        <Typography sx={{mb:1}} variant={'h5'}>
            Итого: {store.getBasketSum()}$
        </Typography>
        <Button onClick={() => setIsOpen(true)} color={'primary'} variant={'contained'}>Оформить заказ</Button>

        <Modal
            hideBackdrop
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Box className={'modal'}>
                <Typography sx={{mb:3}} variant="h6" component="h2">
                    Оформление заказа
                </Typography>
                <Stack spacing={2} sx={{mb:3}}>
                    <TextField value={fio} onChange={(e) => setFio(e.target.value)} fullWidth  label="ФИО" focused />
                    <TextField value={address} onChange={(e) => setAddress(e.target.value)} fullWidth  label="Адрес доставки"  />
                    <TextField value={post} onChange={(e) => setPost(e.target.value)} fullWidth  label="Отделение почты"  />
                    <TextField value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth  label="Номер телефона"  />
                </Stack>
                <Button sx={{mr:2}} onClick={handleSubmit} variant="contained">Готово</Button>
                <Button onClick={() => setIsOpen(false)} variant="text">Отмена</Button>
            </Box>
        </Modal>
    </>;
}

const Basket = () => {
    const [showDrawer, setShowDrawer] = useState(false)
    const [previews, getPreviews] = usePreviews(true)

    useEffect(() => {
        getPreviews()
    }, [])

    return (
        <React.Fragment>
            <div onClick={() => setShowDrawer(true)} className="basket">
                <div className="basket__icon"></div>
                <div className="basket__count">{store.basket.length}</div>
            </div>

            <Drawer
                anchor={'left'}
                open={showDrawer}
                className={'basket-drawer'}
                style={{width:'90%'}}
                onClose={() => setShowDrawer(false)}
            >
                <div className={'basket-wrapper'}>
                    <div className={'basket-box'}>
                        {store.basket.map((item, i) => <BasketItem previews={previews} key={'basket-item-'+i} item={item} />)}
                    </div>
                    {!store.basket.length ? <p>Корзина пуста</p> : <BasketFooter />}
                </div>
            </Drawer>
        </React.Fragment>
    );
};

export default observer(Basket);