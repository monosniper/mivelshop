import axios from "axios";

const getAll = async (type='products') => {
    const rs =  await axios.get('/api/orders');
    return rs.data;
}

const _delete = async (id) => {
    const rs =  await axios.delete('/api/orders/'+id);
    return rs.data;
}

const itemService = {
    getAll,
    delete: _delete,
}

export default itemService