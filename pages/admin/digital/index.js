import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {Link} from "../../../components/Link";
import {AiFillCheckCircle} from "react-icons/ai";
import itemService from "../../../services/itemService";
import categoryService from "../../../services/categoryService";
import {list, meta} from "ya-disk";
import {Stack} from "@mui/material";

const Index = () => {
    const [items, setItems] = useState(null);
    const [previews, setPreviews] = useState({});

    useEffect(() => {
        itemService.getAll('digital').then(x => {
            setItems(x.data)
            const data = list(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, {limit: 999999}).then(rs => {
                const newItems = {}
                rs.items.filter(item => item.path.indexOf(process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME) !== -1).forEach(item => {
                    const uuid = item.name.split('.')[0]
                    newItems[uuid] = item.preview
                })
                setPreviews(newItems)
            });
        });
    }, []);

    function deleteItem(id) {
        setItems(items.map((x) => {
            if (x._id === id) { x.isDeleting = true; }
            return x;
        }));
        itemService.delete(id).then(() => {
            setItems(items => items.filter(x => x._id !== id));
        });
    }

    return (
        <AdminLayout>
            <h1>Digital</h1>
            <Link href="digital/add" className="btn btn-sm btn-success mb-2">Добавить digital</Link>
            <table className="table table-striped table-responsive">
                <thead>
                <tr>
                    <th style={{ width: '20%' }}></th>
                    <th style={{ width: '10%' }}>Название</th>
                    <th style={{ width: '10%' }}>Цена</th>
                    <th style={{ width: '30%' }}>Описание</th>
                    <th style={{ width: '10%' }}>Категория</th>
                    <th style={{ width: '10%' }}>Длинный</th>
                    <th style={{ width: '10%' }}></th>
                </tr>
                </thead>
                <tbody>
                {items && items.map(item => {
                    return <tr key={item._id}>
                        <td><img style={{maxWidth: 120}} src={previews[item.uuid]} alt={item.name}/></td>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{item.description}</td>
                        <td>{item.category.name}</td>
                        <td>{item.long ? <AiFillCheckCircle /> : null}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{display:"flex",alignItems:"center",gap:'.3rem'}}>
                                <Link href={"digital/"+item._id} className="btn btn-sm btn-success">Редактировать</Link>
                                <button onClick={() => deleteItem(item._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={item.isDeleting}>
                                    {item.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Удалить</span>
                                    }
                                </button>
                            </div>
                        </td>
                    </tr>
                })}
                {!items &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                        </td>
                    </tr>
                }
                {items && !items.length &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="p-2">Нет digital</div>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Index;