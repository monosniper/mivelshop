import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {
    Button,
    FormControl, Input,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextareaAutosize,
    TextField
} from "@mui/material";
import store from "../../../store/store";
import {observer} from "mobx-react";
import {useRouter} from "next/router";
import categoryService from "../../../services/categoryService";

const Add = () => {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const router = useRouter()

    useEffect(() => {
        store.requestCategories();
    }, [])

    const handleSubmit = () => {
        categoryService.create({
            type,
            name,
        }).then(rs => {
            if(rs.ok) router.push('/admin/categories')
            else alert('Произошла ошибка')
        })
    }

    return (
        <AdminLayout>
            <h1>Добавить категорию</h1>
            <Stack spacing={2} style={{width:400}}>
                <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Название" variant="filled" focused />
                <FormControl>
                    <InputLabel id="category-select-label">Тип</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        fullWidth
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value={'products'}>Товары</MenuItem>
                        <MenuItem value={'digital'}>Digital</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleSubmit}>Ок</Button>
            </Stack>
        </AdminLayout>
    );
};

export default observer(Add);