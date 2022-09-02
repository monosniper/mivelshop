import dbConnect from "../../../utils/db";
import Basket from "../../../models/basket";
import Category from "../../../models/category";
import Item from "../../../models/item";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                const { user_id, item_id } = req.body;

                if (!user_id || !item_id) throw "invalid data";

                const basket = await Basket.findOneAndUpdate(
                    {user:user_id},
                    {$pull: {items: {$eq: item_id}}},
                    {new: true}
                ).populate({ path: 'items', model: Item })

                if (!basket) throw 'Корзина не найдена';

                res.status(200).json({ok: true, data: basket.items});
            } catch (error) {
                console.log(error);
                res.status(500).json({ok: false, error});
            }
            break;
        case "PUT":
            try {
                const { user_id, item_id } = req.body;

                if (!user_id || !item_id) throw "invalid data";

                const basket = await Basket.findOneAndUpdate(
                    {user:user_id},
                    {$push: {items: item_id}},
                    {new: true}
                ).populate({ path: 'items', model: Item })

                if (!basket) throw 'Корзина не найдена';

                res.status(200).json({ok: true, data: basket.items});
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
};
