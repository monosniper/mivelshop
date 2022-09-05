import React, {useState} from 'react';
import {
    Box,
    Button,
    Drawer,
    ListItemText,
    MenuItem,
    MenuList,
    Modal,
    Stack,
    Typography
} from "@mui/material";
import {observer} from "mobx-react";
import store from "../store/store";
import {Link} from "./Link";

function Order({order}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOrder = () => {
        const params = {
            public_key: process.env.NEXT_PUBLIC_QIWI_PUBLIC_KEY,
            'customFields[themeCode]': process.env.NEXT_PUBLIC_QIWI_THEME_CODE,
            successUrl: 'http://localhost:3004/success',
            comment: 'Оплата товаров в MivelShop - ' + order.items.map(item => item.name).join(', '),
            account : '79643210393',
            phone: order.phone,
            email: order.email,
            billId: order.billId,
            amount: store.getBasketSum(order.items),
        }

        let url = 'https://oplata.qiwi.com/create?' + new URLSearchParams(params).toString();

        window.location.replace(url)
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
                        {store.getBasketSum(order.items)}₽
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
                <div className="user__avatar"></div>
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
                {store.orders.map((order, i) => <Order key={'order-'+i} order={order} />)}
                {!store.orders.length ? <p style={{padding: '1rem'}}>У вас еще не было заказов</p> : null}
            </Drawer>
        </React.Fragment>
    );
};

export default observer(User);