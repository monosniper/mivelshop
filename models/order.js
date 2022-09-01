import mongoose, {Schema} from "mongoose";

const OrderSchema = new mongoose.Schema({
    fio: String,
    address: String,
    post: String,
    phone: String,
    payed: {
        type: Boolean,
        default: false
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;