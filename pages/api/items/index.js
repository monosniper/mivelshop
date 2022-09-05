import dbConnect from "../../../utils/db";
import Item from "../../../models/item";
import Category from "../../../models/category";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const {
                    category,
                    type,
                    limit,
                    offset,
                    get,
                } = req.query

                let filters = {}

                if(type) {
                    filters.type = type
                }

                if(category) {
                    filters.category = category
                }

                if(get && get === 'count') {
                    const count = await Item.find(filters).count();
                    res.status(200).json({ok: true, data: count });
                    return;
                }

                let items = await Item.find(filters, null, {limit, skip: offset}).sort({createdAt: -1})
                    .populate({ path: 'category', model: Category });

                res.status(200).json({ok: true, data: items });
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;

        case "POST":
            try {
                const {
                    uuid,
                    name,
                    type,
                    price,
                    height,
                    description,
                    category,
                } = req.body;

                if (
                    !uuid
                    || !name
                    || !type
                    || !price
                    || !height
                    || !description
                    || !category
                ) throw "invalid data";
                const item = await Item.create(
                    {
                        uuid,
                        name,
                        type,
                        price,
                        height,
                        description,
                        category,
                    });

                res.status(201).json({ok: true, data:item});
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;
    }
};
