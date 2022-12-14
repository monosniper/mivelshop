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
import b64toBlob from "../../../utils/b64toBlob";
import {resources} from "ya-disk";

const Edit = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState(false)
    const [height, setHeight] = useState(false)
    const [uuid, setUuid] = useState('')
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(false)
    const files_limit = 10

    useEffect(() => {
        if(router.query.id) {
            itemService.getOne(router.query.id).then(rs => {
                if(rs.ok) {
                    setItem(rs.data)
                    setName(rs.data.name)
                    setPrice(rs.data.price)
                    setHeight(rs.data.height)
                    setDescription(rs.data.description)
                    setCategory(rs.data.category)
                    setUuid(rs.data.uuid)
                }
            })
        }
    }, [router.query])

    const handleUpload = async (e) => {
        const files = e.target.files;

        if(files.length > files_limit) {
            alert('Максимальное кол-во картинок - '+files_limit)
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
            })
        }

        setLoading(true)
        resources.remove(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, 'disk:/' + process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME + '/' + uuid, true).then(() => {
            setTimeout(() => {
                createFolderThenUpload()
                setLoading(false)
            }, files_limit * 700)
        })
    }

    const handleSubmit = () => {
        itemService.update(router.query.id, {
            name,
            price,
            height,
            description,
            category,
        }).then(rs => {
            if(rs.ok) router.push('/admin/products')
            else alert('Произошла ошибка')
        })
    }

    return (
        <AdminLayout>
            <h1>Обновить товар</h1>
            {item ? <Stack spacing={2} style={{width: 400}}>
                <input type="file" multiple onChange={handleUpload}/>
                {loading ? <p>Файлы загружаются...</p> : null}

                <TextField fullWidth value={name} onChange={e => setName(e.target.value)} label="Название"
                           variant="filled" focused/>
                <InputLabel>Цена</InputLabel>
                <Input type={'number'} fullWidth value={price} onChange={e => setPrice(e.target.value)} label="Цена" variant="filled"/>
                <span>Высота</span>
                <Input fullWidth value={height} type={'number'} onChange={e => setHeight(e.target.value)} label="Высота" variant="filled" />
                <TextareaAutosize
                    className={'textarea'} placeholder={'Описание'} onChange={e => setDescription(e.target.value)}
                    value={description}
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
                        {store.categories.filter(cat => cat.type === 'products').map((cat, i) =>
                            <MenuItem
                                key={'cat-' + i}
                                value={cat._id}
                                selected={cat._id === category}
                            >
                                {cat.name}
                            </MenuItem>)}
                    </Select>
                </FormControl>
                <Button onClick={handleSubmit}>Ок</Button>
            </Stack> : <p>Загрузка...</p>}
        </AdminLayout>
    );
};

export default Edit;