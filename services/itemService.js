import axios from "axios";

const getAll = async (type='products') => {
    const rs =  await axios.get('/api/items?type='+ type);
    return rs.data;
}

const _delete = async (id) => {
    const rs =  await axios.delete('/api/items/'+id);
    return rs.data;
}

const update = async (id, data) => {
    const rs =  await axios.put('/api/items/'+id, data);
    return rs.data;
}

const getOne = async (id) => {
    const rs = await axios.get('/api/items/'+id);
    return rs.data;
}

const itemService = {
    getAll,
    getOne,
    update,
    delete: _delete,
}

export default itemService