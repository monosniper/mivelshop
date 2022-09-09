import dbConnect from "../../../utils/db";
import Basket from "../../../models/basket";
import Order from "../../../models/order";
import Item from "../../../models/item";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const { user } = req.query
                const filters = {}

                if(user) {
                    filters.user = user
                }

                const orders = await Order.find(filters).sort({createdAt: -1}).populate({ path: 'items', model: Item })

                res.status(200).json({ok: true, data: orders });
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;

        case "POST":
            try {
                const {
                    fio,
                    address,
                    post,
                    phone,
                    user,
                    billId,
                    items,
                } = req.body;

                if (
                    !fio
                    || !address
                    || !post
                    || !phone
                    || !billId
                    || !items
                ) throw "invalid data";

                const order = await Order.create(
                    {
                        fio,
                        address,
                        post,
                        phone,
                        user,
                        billId,
                        items,
                    });

                // Clear basket after order creation
                try {
                    await Basket.findOneAndUpdate({user},{items:[]})
                } catch (e) {
                    console.log()
                }

                res.status(201).json({ok: true, data: order});
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;
    }
};
