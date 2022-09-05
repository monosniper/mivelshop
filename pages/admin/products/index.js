import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {Link} from "../../../components/Link";
import {AiFillCheckCircle} from "react-icons/ai";
import itemService from "../../../services/itemService";
import categoryService from "../../../services/categoryService";
import {list, meta} from "ya-disk";
import usePreviews from "../../../hooks/usePreviews";
import Image from "next/image";
import {Button} from "@mui/material";

const getCategoryName = async (id) => {
    const category = await categoryService.getOne(id)
    return category.name;
}

const Index = () => {
    const [items, setItems] = useState(null);
    const [previews, getPreviews] = usePreviews(true);

    useEffect(() => {
        itemService.getAll('products').then(x => {
            setItems(x.data)

            getPreviews()
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
            <h1>Товары</h1>
            <Link href="products/add" className="btn btn-sm btn-success mb-2">Добавить товар</Link>
            <table className="table table-striped table-responsive">
                <thead>
                <tr>
                    {/*<th style={{ width: '20%' }}></th>*/}
                    <th style={{ width: '20%' }}>Название</th>
                    <th style={{ width: '10%' }}>Цена</th>
                    <th style={{ width: '40%' }}>Описание</th>
                    <th style={{ width: '10%' }}>Категория</th>
                    <th style={{ width: '10%' }}>Высота</th>
                    <th style={{ width: '10%' }}></th>
                </tr>
                </thead>
                <tbody>
                {items && items.map(item => previews[item.uuid] ? <tr key={item._id}>
                    {/*<td>*/}
                    {/*    <img style={{maxWidth: 120}} src={previews[item.uuid][0]} alt={item.name}/>*/}
                    {/*    <Image*/}
                    {/*        src={previews[item.uuid][0]}*/}
                    {/*        alt={item.name}*/}
                    {/*        width={'120px'}*/}
                    {/*        height={'100%'}*/}
                    {/*        // layout={'fill'}*/}
                    {/*        placeholder={'blur'}*/}
                    {/*    />*/}
                    {/*</td>*/}
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category.name}</td>
                    <td>{item.height}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{display:"flex",alignItems:"center",gap:'.3rem',flexWrap:'wrap'}}>
                            <Link href={"products/"+item._id} className="btn btn-sm btn-success">Редактировать</Link>
                            <button onClick={() => deleteItem(item._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={item.isDeleting}>
                                {item.isDeleting
                                    ? <span className="spinner-border spinner-border-sm"></span>
                                    : <span>Удалить</span>
                                }
                            </button>
                            <Link target={'_blank'} href={'/items/'+item._id}>
                                <button className="btn btn-sm btn-primary">Посмотреть</button>
                            </Link>
                        </div>
                    </td>
                </tr> : null)}
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
                            <div className="p-2">Нет товаров</div>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Index;