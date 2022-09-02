import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {Link} from "../../../components/Link";
import {AiFillCheckCircle} from "react-icons/ai";
import itemService from "../../../services/itemService";
import categoryService from "../../../services/categoryService";
import {list, meta} from "ya-disk";
import Swal from "sweetalert2";
import store from "../../../store/store";
import orderService from "../../../services/orderService";


const Index = () => {
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        orderService.getAll().then(x => {
            setOrders(x.data)
        });
    }, []);

    function deleteOrder(id) {
        setOrders(orders.map((x) => {
            if (x._id === id) { x.isDeleting = true; }
            return x;
        }));
        orderService.delete(id).then(() => {
            setOrders(orders => orders.filter(x => x._id !== id));
        });
    }

    return (
        <AdminLayout>
            <h1>Заказы</h1>
            <table className="table table-striped table-responsive">
                <thead>
                <tr>
                    <th style={{ width: '10%' }}>Оплачено</th>
                    <th style={{ width: '10%' }}>ФИО</th>
                    <th style={{ width: '10%' }}>Почта</th>
                    <th style={{ width: '10%' }}>Почтовое отделение</th>
                    <th style={{ width: '10%' }}>Номер телефона</th>
                    <th style={{ width: '10%' }}>Товары / Digital</th>
                    <th style={{ width: '10%' }}>Сумма</th>
                    <th style={{ width: '10%' }}></th>
                </tr>
                </thead>
                <tbody>
                {orders && orders.map(item => {
                    return <tr key={item._id}>
                        <td>{item.payed ? <AiFillCheckCircle /> : null}</td>
                        <td>{item.fio}</td>
                        <td>{item.email}</td>
                        <td>{item.post}</td>
                        <td>{item.phone}</td>
                        <td>{item.items.map(item => item.name).join(', ')}</td>
                        <td>${store.getBasketSum(item.items)}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{display:"flex",alignItems:"center",gap:'.3rem'}}>
                                <button onClick={() => deleteOrder(item._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={item.isDeleting}>
                                    {item.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Удалить</span>
                                    }
                                </button>
                            </div>
                        </td>
                    </tr>
                })}
                {!orders &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                        </td>
                    </tr>
                }
                {orders && !orders.length &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="p-2">Нет заказов</div>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Index;