import React, {useState} from 'react';
import {Box, Button, Input, Modal, Stack, TextField, Typography} from "@mui/material";
import RegisterModal from "./RegisterModal";
import cookie from "js-cookie";
import store from "../store/store";

const AuthButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [loginError, setLoginError] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = () => {
        fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((r) => {
                return r.json();
            })
            .then((data) => {
                if (data && data.error) {
                    setLoginError(data.message);
                }
                if (data && data.token) {
                    //set cookie
                    cookie.set('token', data.token, {expires: 2});
                    store.setLoggedIn(true)
                    setIsOpen(false)
                }
            });
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} color={'white'} variant="contained">Войти</Button>
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={() => setIsOpen(false)}
            >
                <Box className={'modal'}>
                    <Typography sx={{mb:3}} id="modal-modal-title" variant="h6" component="h2">
                        Вход
                    </Typography>
                    {loginError && <Typography sx={{mb:3}} style={{color: 'red'}}>{loginError}</Typography>}
                    <Stack spacing={2} sx={{mb:3}}>
                        <TextField value={email} onChange={(e) => setEmail(e.target.value)} fullWidth  label="Почта" type={'email'} focused />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} fullWidth  label="Пароль" type={'password'} />
                    </Stack>
                    <Button sx={{mr:2}} onClick={handleSubmit} variant="contained">Войти</Button>

                    <RegisterModal />
                </Box>
            </Modal>
        </>
    );
};

export default AuthButton;