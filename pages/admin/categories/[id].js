import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import itemService from "../../../services/itemService";
import {v4 as uuidv4} from "uuid";
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextareaAutosize,
    TextField
} from "@mui/material";
import store from "../../../store/store";
import AdminLayout from "../../../components/AdminLayout";
import axios from "axios";
import categoryService from "../../../services/categoryService";

const Edit = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [category, setCategory] = useState(null)

    useEffect(() => {
        if(router.query.id) {
            categoryService.getOne(router.query.id).then(rs => {
                console.log(rs)
                if(rs.ok) {
                    setCategory(rs.data)
                    setName(rs.data.name)
                    setType(rs.data.type)
                }
            })
        }
    }, [router.query])

    const handleSubmit = () => {
        categoryService.update(router.query.id, {
            name,
            type,
        }).then(rs => {
            if(rs.ok) router.push('/admin/categories')
            else alert('Произошла ошибка')
        })
    }

    return (
        <AdminLayout>
            <h1>Обновить категорию</h1>
            {category ? <Stack spacing={2} style={{width: 400}}>
                <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Название"
                           variant="filled" focused/>
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
            </Stack> : <p>Загрузка...</p>}
        </AdminLayout>
    );
};

export default Edit;