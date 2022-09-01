import User from "../../../models/user";
import dbConnect from "../../../utils/db";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "DELETE":
            try {
                const { id } = req.query;

                if (!id) throw "invalid data";

                const user = await User.deleteOne({_id:id})

                if (!user) throw 'Пользователь не найден';

                res.status(200).json({ok: true, data: {}});
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