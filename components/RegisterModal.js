import React, {useState} from 'react';

import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import cookie from "js-cookie";
import Router from "next/router";
import store from "../store/store";

const RegisterModal = () => {
    const [signupError, setSignupError] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')

    const handleSubmit = () => {
        if(passwordAgain !== password) {
            setSignupError('Пароли не совпадают')
        } else {
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data && data.error) {
                        setSignupError(data.message);
                    }
                    if (data && data.token) {
                        //set cookie
                        cookie.set('token', data.token, {expires: 2});
                        Router.push('/');
                        store.setLoggedIn(true)
                        setIsOpen(false)
                    }
                });
        }
    }

    return (
        <>
            <Button variant="text" onClick={() => setIsOpen(true)}>Создать аккаунт</Button>
            <Modal
                hideBackdrop
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box className={'modal'}>
                    <Typography sx={{mb:3}} variant="h6" component="h2">
                        Создать аккаунт
                    </Typography>
                    {signupError && <Typography sx={{mb:3}} style={{color: 'red'}}>{signupError}</Typography>}
                    <Stack spacing={2} sx={{mb:3}}>
                        <TextField value={name} onChange={(e) => setName(e.target.value)} fullWidth  label="Имя" focused />
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} fullWidth  label="Почта" type={'email'} />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} fullWidth  label="Пароль" type={'password'} />
                        <TextField value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} fullWidth  label="Пароль еще раз" type={'password'} />
                    </Stack>
                    <Button sx={{mr:2}} onClick={handleSubmit} variant="contained">Готово</Button>
                    <Button onClick={() => setIsOpen(false)} variant="text">Уже есть аккаунт</Button>
                </Box>
            </Modal>
        </>
    );
};

export default RegisterModal;