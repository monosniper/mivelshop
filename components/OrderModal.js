import React, {useState} from 'react';
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";


const OrderModal = ({ isOpen, setIsOpen, handleSubmit }) => {
    const [fio, setFio] = useState('')
    const [address, setAddress] = useState('')
    const [post, setPost] = useState('')
    const [phone, setPhone] = useState('')

    return (
        <Modal
            // hideBackdrop
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
                <Button sx={{mr:2}} onClick={() => handleSubmit({
                    fio, address, post, phone
                })} variant="contained">Готово</Button>
                <Button onClick={() => setIsOpen(false)} variant="text">Отмена</Button>
            </Box>
        </Modal>
    );
};

export default OrderModal;