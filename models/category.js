import mongoose, {Schema} from "mongoose";

const CategorySchema = new mongoose.Schema({
    type: String,
    name: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;