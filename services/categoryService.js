import axios from "axios";

const getAll = async (type=false) => {
    let url = '/api/categories'
    if(type) url += '?type='+type
    const rs = await axios.get(url);
    return rs.data;
}

const getOne = async (id, type='products') => {
    const rs = await axios.get('/api/categories/' + id);
    return rs.data;
}

const update = async (id, data) => {
    const rs =  await axios.put('/api/categories/'+id, data);
    return rs.data;
}

const _delete = async (id) => {
    const rs = await axios.delete('/api/categories/'+id);
    return rs.data;
}

const create = async (data) => {
    const rs = await axios.post('/api/categories', data);
    return rs.data;
}

const categoryService = {
    getAll,
    getOne,
    update,
    delete: _delete,
    create,
}

export default categoryService