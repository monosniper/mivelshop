import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {Link} from "../../../components/Link";
import {AiFillCheckCircle} from "react-icons/ai";
import itemService from "../../../services/itemService";
import categoryService from "../../../services/categoryService";
import {list, meta} from "ya-disk";
import Swal from "sweetalert2";

const Index = () => {
    const [categories, setCategories] = useState(null);
    const [previews, setPreviews] = useState({});

    useEffect(() => {
        categoryService.getAll().then(x => {
            setCategories(x.data)
            const data = list(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, {limit: 999999}).then(rs => {
                const newItems = {}
                rs.items.filter(item => item.path.indexOf(process.env.NEXT_PUBLIC_YANDEX_DISK_FOLDER_NAME) !== -1).forEach(item => {
                    const uuid = item.name.split('.')[0]
                    newItems[uuid] = item.file
                })
                setPreviews(newItems)
            });
        });
    }, []);

    function deleteCategory(id) {
        Swal.fire({
            title: 'Вы уверены?',
            text: "Все связанные товары и услуги будут также удалены",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да'
        }).then((result) => {
            if (result.isConfirmed) {
                setCategories(categories.map((x) => {
                    if (x._id === id) { x.isDeleting = true; }
                    return x;
                }));
                categoryService.delete(id).then(() => {
                    setCategories(categories => categories.filter(x => x._id !== id));
                });
            }
        })
    }

    return (
        <AdminLayout>
            <h1>Категории</h1>
            <Link href="categories/add" className="btn btn-sm btn-success mb-2">Добавить категорию</Link>
            <table className="table table-striped table-responsive">
                <thead>
                <tr>
                    <th style={{ width: '10%' }}>Название</th>
                    <th style={{ width: '10%' }}>Тип</th>
                    <th style={{ width: '10%' }}></th>
                </tr>
                </thead>
                <tbody>
                {categories && categories.map(item => {
                    return <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{display:"flex",alignItems:"center",gap:'.3rem'}}>
                                <Link href={"categories/"+item._id} className="btn btn-sm btn-success">Редактировать</Link>
                                <button onClick={() => deleteCategory(item._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={item.isDeleting}>
                                    {item.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Удалить</span>
                                    }
                                </button>
                            </div>
                        </td>
                    </tr>
                })}
                {!categories &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                        </td>
                    </tr>
                }
                {categories && !categories.length &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="p-2">Нет категорий</div>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Index;