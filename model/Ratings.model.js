const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const RatingsSchema = new Schema(
	{
		userId: { type: mongoose.Types.ObjectId, ref: 'user' },
        listId:{ type: mongoose.Types.ObjectId, ref: 'list' },
        rating:Number,
		isActive: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
	}, 
	{ timestamps: true }
);
 
module.exports = mongoose.model('rating', RatingsSchema);