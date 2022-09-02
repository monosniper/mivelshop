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
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import {resources} from "ya-disk";
import {useRouter} from "next/router";
import b64toBlob from "../../../utils/b64toBlob";

const Add = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [long, setLong] = useState(false)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState(false)
    const [uuid, setUuid] = useState(uuidv4())
    const [createdFolder, setCreatedFolder] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        store.requestCategories();
    }, [])

    const handleUpload = async (e) => {
        const files = e.target.files;

        if(files.length > 3) {
            alert('Максимальное кол-во картинок - 3')
            return;
        }

        const loadFiles = () => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const reader = new FileReader();

                axios.get(
                    'https://cloud-api.yandex.net/v1/disk/resources/upload?overwrite=true&path='
                    + process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME
                    + '/' + uuid + '/'
                    + i + '.'
                    + e.target.value.split('.').pop(),
                    {
                        headers: {
                            "Authorization": "OAuth "+process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN
                        }
                    }).then(rs => {
                    reader.onload = function(e) {
                        axios.put(rs.data.href, b64toBlob(e.target.result), {
                            headers: {
                                "Content-Type": file.type,
                            }
                        }).then(rs => {
                            console.log(rs)
                        })
                    };
                    reader.onerror = function(e) {
                        // error occurred
                        console.log('Error : ' + e.type);
                        alert('Произошла ошибка. (' + e.type + ')')
                    };
                    reader.readAsDataURL(file);
                })
            }
        }

        const createFolderThenUpload = () => {
            resources.create(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, 'disk:/' + process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME + '/' + uuid).then(() => {
                loadFiles()
                setLoading(false)
                setCreatedFolder(true)
            })
        }

        try {
            setLoading(true)
            createdFolder ? resources.remove(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, 'disk:/' + process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME + '/' + uuid, true).then(() => {
                setTimeout(() => {
                    createFolderThenUpload()
                    setLoading(false)
                }, 3000)
                setCreatedFolder(true)
            }) : createFolderThenUpload()
        } catch (e) {
            loadFiles()
        }
    }

    const handleSubmit = () => {
        store.createItem({
            type: 'products',
            uuid,
            name,
            price,
            description,
            long,
            category,
        }).then(rs => {
            if(rs.ok) router.push('/admin/products')
            else alert('Произошла ошибка')
        })
    }

    return (
        <AdminLayout>
            <h1>Добавить товар</h1>
            <Stack spacing={2} style={{width:400}}>
                <input max={3} multiple type="file" onChange={handleUpload}/>
                {loading ? <p>Файлы загружаются...</p> : null}
                <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Название" variant="filled" focused />
                <InputLabel>Цена</InputLabel>
                <Input type={'number'} fullWidth value={price} onChange={e => setPrice(e.target.value)} label="Цена" variant="filled"/>
                <span>Длинный</span>
                <Switch checked={long} onChange={e => setLong(e.target.checked)}  />
                <TextareaAutosize
                    className={'textarea'} placeholder={'Описание'} onChange={e => setDescription(e.target.value)} value={description}
                />
                <FormControl>
                    <InputLabel id="category-select-label">Категория</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {store.categories.filter(cat => cat.type === 'products').map((cat, i) => <MenuItem key={'cat-'+i} value={cat._id}>{cat.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button onClick={handleSubmit}>Ок</Button>
            </Stack>
        </AdminLayout>
    );
};

export default observer(Add);