import React, {useEffect, useState} from 'react';
import AdminLayout from "../../../components/AdminLayout";
import {Link} from "../../../components/Link";
import userService from "../../../services/userService";
import {AiFillCheckCircle} from "react-icons/ai";

const Index = () => {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        userService.getAll().then(x => setUsers(x.data));
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(id).then(() => {
            setUsers(users => users.filter(x => x._id !== id));
        });
    }

    return (
        <AdminLayout>
            <h1>Пользователи</h1>
            {/*<Link href="users/add" className="btn btn-sm btn-success mb-2">Add User</Link>*/}
            <table className="table table-striped table-responsive">
                <thead>
                <tr>
                    <th style={{ width: '40%' }}>Имя</th>
                    <th style={{ width: '50%' }}>Почта</th>
                    <th style={{ width: '50%' }}>Админ</th>
                    <th style={{ width: '10%' }}></th>
                </tr>
                </thead>
                <tbody>
                {users && users.map(user =>
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? <AiFillCheckCircle /> : null}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                            <button onClick={() => deleteUser(user._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                {user.isDeleting
                                    ? <span className="spinner-border spinner-border-sm"></span>
                                    : <span>Удалить</span>
                                }
                            </button>
                        </td>
                    </tr>
                )}
                {!users &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="spinner-border spinner-border-lg align-center"></div>
                        </td>
                    </tr>
                }
                {users && !users.length &&
                    <tr>
                        <td colSpan="4" className="text-center">
                            <div className="p-2">Нет пользователей</div>
                        </td>
                    </tr>
                }
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Index;