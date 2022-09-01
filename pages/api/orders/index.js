import dbConnect from "../../../utils/db";
import Basket from "../../../models/basket";
import Order from "../../../models/order";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const { user } = req.query

                const orders = await Order.find({user}).sort({createdAt: -1}).populate('items');

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
                } = req.body;

                if (
                    !fio
                    || !address
                    || !post
                    || !phone
                    || !user
                ) throw "invalid data";

                const basket = await Basket.findOne({user})
                console.log(basket.items, basket, user)
                const order = await Order.create(
                    {
                        fio,
                        address,
                        post,
                        phone,
                        user,
                        items: basket.items,
                    });

                // Clear basket after order creation
                await Basket.findOneAndUpdate({user},{items:[]})

                res.status(201).json({ok: true, data: order});
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;
    }
};
