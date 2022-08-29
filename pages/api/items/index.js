const items = [
    {
        id: 1,
        type: 'products',
        name: 'Name',
        price: 49,
        category_id: 1,
        long: false,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, adipisci atque blanditiis commodi expedita id iure, nobis quibusdam repellendus unde vel velit voluptates. Delectus deleniti illum, laborum nesciunt sint temporibus!'
    },
    {
        id: 2,
        type: 'products',
        name: 'Name',
        price: 49,
        category_id: 2,
        long: true,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, adipisci atque blanditiis commodi expedita id iure, nobis quibusdam repellendus unde vel velit voluptates. Delectus deleniti illum, laborum nesciunt sint temporibus!'
    }
]

export default (req, res) => {
    const { category, type } = req.query
    let data = [...items]

    if(type) {
        data = data.filter(item => item.type === type)
    }

    if(category) {
        data = data.filter(item => item.category_id === category)
    }

    res.status(200).json({
        ok: true,
        data
    });
};
