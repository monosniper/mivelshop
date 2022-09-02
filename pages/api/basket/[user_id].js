import dbConnect from "../../../utils/db";
import Basket from "../../../models/basket";
import Item from "../../../models/item";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const { user_id } = req.query;

                if (!user_id) throw "invalid data";

                const basket = await Basket.findOne({user:user_id}).populate({ path: 'items', model: Item })

                if (!basket) {
                    await Basket.create({user:user_id,items:[]})
                    res.status(200).json({ok: true, data: []});
                }

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
