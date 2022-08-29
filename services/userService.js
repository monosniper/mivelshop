const getAll = async () => {
    return [];
}

const _delete = async (id) => {
    return true;
}

const userService = {
    getAll,
    delete: _delete,
}

export default userService