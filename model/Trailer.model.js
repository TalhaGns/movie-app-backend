const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailersSchema = new Schema(
	{
		title: { type: String },
		type: { type: String },
		year: { type: Number },
		duration: { type: String },
		mediaId: { type: mongoose.Types.ObjectId, required: true, ref: 'media' },
		bannerId: { type: mongoose.Types.ObjectId, required: true, ref: 'media' },
		cast: { type: Array },
		description: { type: String },
		genre: [{ type: mongoose.Types.ObjectId, ref: 'category' }],
		ageRestriction: { type: Number },
		tags: { type: Array },
		trailerUrl: { type: String },
		likes: { type: Number, default: 0 },
		totalSeasons: { type: Number },
		seasonNumber: { type: Number },
		episodeNumber: { type: Number },
		episodeTitle: { type: String },
		director: { type: String },
		imdb: { type: String },
		websiteId: [{ type: Schema.Types.ObjectId, ref: 'website', default: [] }],
		userRating: { type: Array, default: [] },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('trailer', TrailersSchema);
