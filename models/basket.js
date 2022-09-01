import mongoose, {Schema} from "mongoose";

const BasketSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Basket = mongoose.models.Basket || mongoose.model("Basket", BasketSchema);

export default Basket;