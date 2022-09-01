import Category from "../../../models/category";
import dbConnect from "../../../utils/db";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const { type } = req.query
                let filters = {}

                if(type) {
                    filters.type = type
                }

                const items = await Category.find(filters);
                res.status(200).json({ok: true, data: items });
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;

        case "POST":
            try {
                const { name, type } = req.body;

                if (!name && !type) throw "invalid data";
                const category = await Category.create({ name, type });

                res.status(201).json({ok:true, data:category});
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;
    }
};
