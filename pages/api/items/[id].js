import dbConnect from "../../../utils/db";
import Item from "../../../models/item";
import Category from "../../../models/category";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "DELETE":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const item = await Item.deleteOne({_id:id})

                if (!item) throw 'Продукт не найден';

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

                const item = await Item.findOne({_id:id})

                if (!item) throw 'Продукт не найден';

                res.status(200).json({ok: true, data: item});
            } catch (error) {
                console.log(error);
                res.status(500).json({ok: false, error});
            }
            break;
        case "PUT":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const item = await Item.findByIdAndUpdate(id, req.body, {new:true})

                if (!item) throw 'Продукт не найден';

                res.status(200).json({ok: true, data: item});
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