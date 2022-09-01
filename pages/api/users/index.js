import dbConnect from "../../../utils/db";
import Item from "../../../models/item";
import User from "../../../models/user";
import jwt from "jsonwebtoken";

dbConnect();

export default async (req, res) => {
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                let filters = {}

                const users = await User.find(filters);
                res.status(200).json({ok: true, data: users });
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;

        case "POST":
            try {
                const {
                    name,
                    email,
                    password,
                } = req.body;

                if (
                    !name
                    || !email
                    || !password
                ) throw "invalid data";

                const exists = await User.find({email})

                if (exists) {
                    const user = await User.create(
                        {
                            name,
                            email,
                            password,
                        });

                    const token = jwt.sign(
                        {userId: user.id, isAdmin: user.isAdmin, name: user.name, email: user.email},
                        process.env.JWT_SECRET,
                        {
                            expiresIn: 3000, //50 minutes
                        },
                    );

                    res.status(200).json({success:true, data: token});
                } else {
                    // User exists
                    res.status(403).json({ok:false, error: 'Почта уже существует'});
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({ ok: false, error });
            }
            break;
    }
};
