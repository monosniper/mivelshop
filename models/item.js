import mongoose, {Schema} from "mongoose";

const ItemSchema = new mongoose.Schema({
    uuid: String,
    type: String,
    name: String,
    price: Number,
    height: {
        type: Number,
        default: 350,
    },
    description: String,
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;