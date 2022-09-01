import Category from "../../../models/category";
import dbConnect from "../../../utils/db";
import Item from "../../../models/item";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "DELETE":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const category = await Category.deleteOne({_id:id})

                if (!category) throw 'Категория не найдена';

                // Delete all items in this category
                await Item.deleteMany({category:id})

                res.status(200).json({ok: true, data: {}});
            } catch (error) {
                console.log(error);
                res.status(500).json({ok: false, error});
            }
            break;
        case "GET":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const category = await Category.findOne({_id:id})

                if (!category) throw 'Категория не найдена';

                res.status(200).json({ok: true, data: category});
            } catch (error) {
                console.log(error);
                res.status(500).json({ok: false, error});
            }
            break;
        case "PUT":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const category = await Category.findByIdAndUpdate(id, req.body, {new:true})

                if (!category) throw 'Категория не найдена';

                res.status(200).json({ok: true, data: category});
            } catch (error) {
                console.log(error);
                res.status(500).json({ok: false, error});
            }
            break;
        default:
            res.statusCode = 401;
            res.end();
            break;
    }
}