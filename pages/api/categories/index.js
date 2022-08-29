const items = [
    {
        id: 1,
        type: 'products',
        name: 'картины',
    },
    {
        id: 2,
        type: 'products',
        name: 'нашивки',
    },
    {
        id: 3,
        type: 'products',
        name: 'одежда',
    },
    {
        id: 4,
        type: 'products',
        name: 'стикеры',
    },
    {
        id: 5,
        type: 'products',
        name: 'магниты',
    },
    {
        id: 6,
        type: 'products',
        name: 'закладки',
    },
    {
        id: 7,
        type: 'products',
        name: 'коробки',
    },
    {
        id: 8,
        type: 'products',
        name: 'раскраска',
    },
    {
        id: 9,
        type: 'products',
        name: 'художество',
    },
    {
        id: 10,
        type: 'products',
        name: 'уникальный костюм',
    },
    {
        id: 11,
        type: 'digital',
        name: 'раскраска',
    },
    {
        id: 12,
        type: 'digital',
        name: 'художество',
    },
    {
        id: 13,
        type: 'digital',
        name: 'уникальный костюм',
    },
]

export default (req, res) => {
    const { type } = req.query
    let data = [...items]

    if(type) {
        data = data.filter(item => item.type === type)
    }

    res.status(200).json({
        ok: true,
        data
    });
};
