import axios from "axios";

const getAll = async () => {
    const rs =  await axios.get('/api/users');
    return rs.data;
}

const _delete = async (id) => {
    const rs =  await axios.delete('/api/users/'+id);
    return rs.data;
}

const userService = {
    getAll,
    delete: _delete,
}

export default userService