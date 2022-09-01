import React, {useState} from 'react';
import Image from "next/image";
import {
    Box,
    Button,
    Drawer,
    ListItemText,
    MenuItem,
    MenuList,
    Modal,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {observer} from "mobx-react";
import store from "../store/store";
import {Link} from "./Link";
import QiwiBillPaymentsAPI from '@qiwi/bill-payments-node-js-sdk';

function Order({order, qiwi}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOrder = () => {
        const fields = {
            amount: store.getBasketSum(order.items),
            currency: 'RUB',
            comment: 'Оплата товаров в MivelShop - ' + order.items.map(item => item.name).join(', '),
            expirationDateTime: qiwi.getLifetimeByDay(1),
            email: order.email,
            account : '79643210393',
            successUrl: 'http://localhost:3004/success'
        };

        qiwi.createBill( qiwi.generateId(), fields ).then( data => {
            console.log(data)
        });
    }

    return <>
        <div className="order" onClick={() => setIsOpen(true)}>
            <span className="order__date">{new Date(order.createdAt).toLocaleDateString()}</span>
            <span className={"order__status " + (order.payed ? '' : 'order__status_not')}>{order.payed ? 'Оплачено' : 'Не оплачено'}</span>
        </div>

        <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <Box className={'modal'}>
                <Typography sx={{mb:5}} variant="h6" component="h2">
                    Заказ #{order._id}
                </Typography>
                <Stack spacing={2} sx={{mb:3}}>
                    <Typography className={'order-row'} component="p">
                        <strong>ФИО:</strong>
                        {order.fio}
                    </Typography>
                    <Typography className={'order-row'} component="p">
                        <strong>Адрес доставки:</strong>
                        {order.address}
                    </Typography>
                    <Typography className={'order-row'} component="p">
                        <strong>Отделение почты:</strong>
                        {order.post}
                    </Typography>
                    <Typography className={'order-row'} component="p">
                        <strong>Номер телефона:</strong>
                        {order.phone}
                    </Typography>
                    <Typography className={'order-row'} component="p">
                        <strong>Товары:</strong>
                        {order.items.map(item => item.name).join(', ')}
                    </Typography>
                    <Typography className={'order-row'} component="p">
                        <strong>Итоговая сумма:</strong>
                        {store.getBasketSum(order.items)}$
                    </Typography>
                </Stack>
                <div style={{textAlign: "center"}}>
                    <Button onClick={handleOrder} size={'large'} color={'primary'} variant="contained">Оплатить</Button>
                </div>
            </Box>
        </Modal>
    </>;
}

const User = ({ logout, user }) => {
    const [showProfile, setShowProfile] = useState(false)
    const qiwiApi = new QiwiBillPaymentsAPI(process.env.NEXT_PUBLIC_QIWI_SECRET_KEY);
    console.log(qiwiApi)

    const handleLogout = () => {
        store.setLoggedIn(false)

        logout()
    }

    const handleOpenOrders = () => {
        store.setIsOrdersDrawerOpen(true)
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
                        alt={user.name}
                    />
                </div>
            </div>

            <Drawer
                anchor={'right'}
                open={showProfile}
                className={'profile-drawer'}
                style={{width:'90%'}}
                onClose={() => setShowProfile(false)}
            >
                <MenuList>
                    {user.isAdmin ? <Link href={'/admin'}>
                        <MenuItem>
                            <ListItemText style={{padding: '10px 30px', textAlign: 'center', color: 'black'}}>Админ панель</ListItemText>
                        </MenuItem>
                    </Link> : null}
                    <MenuItem>
                        <ListItemText onClick={handleOpenOrders} style={{padding: '10px 30px', textAlign: 'center', color: 'black'}}>Мои заказы</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemText onClick={handleLogout} style={{padding: '10px 30px', textAlign: 'center'}}>Выйти</ListItemText>
                    </MenuItem>
                </MenuList>
            </Drawer>

            <Drawer
                anchor={'right'}
                open={store.isOrdersDrawerOpen}
                className={'profile-drawer'}
                style={{width:'90%'}}
                onClose={() => store.setIsOrdersDrawerOpen(false)}
            >
                {store.orders.map((order, i) => <Order qiwi={qiwiApi} key={'order-'+i} order={order} />)}
                {!store.orders.length ? <p>У вас еще не было заказов</p> : null}
            </Drawer>
        </React.Fragment>
    );
};

export default observer(User);