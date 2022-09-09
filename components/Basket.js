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
import QiwiBillPaymentsAPI from "@qiwi/bill-payments-node-js-sdk";
import OrderModal from "./OrderModal";

function BasketItem({previews, item}) {
    const handleDelete = () => {
        store.removeBasket(item._id)
    }

    return <div className="basket-item"
                // style={{backgroundImage: 'url("'+previews[item.uuid]+'")'}}
    >
        <Image
            src={previews[item.uuid][0]}
            alt={item.name}
            layout='fill'
            objectFit='contain'
        />
        <IconButton className={'basket-del-btn'} onClick={handleDelete} aria-label="delete">
            <AiFillDelete />
        </IconButton>
    </div>;
}

function BasketFooter() {
    const [isOpen, setIsOpen] = useState(false)
    const qiwi = new QiwiBillPaymentsAPI(process.env.NEXT_PUBLIC_QIWI_SECRET_KEY);

    const handleSubmit = (data) => {
        store.createOrder({
            ...data,
            items: store.basket.map(item => item._id),
            billId: qiwi.generateId(),
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
            Итого: {store.getBasketSum()}₽
        </Typography>
        <Button onClick={() => setIsOpen(true)} color={'primary'} variant={'contained'}>Оформить заказ</Button>

        <OrderModal isOpen={isOpen} setIsOpen={setIsOpen} handleSubmit={handleSubmit} />
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