const CommentsModel = require('../model/Comment.model');

exports.getAll =async (req,res)=>{

	const{page=1,limit=10}=req.query
	const total = await CommentsModel.find().countDocuments();
	await CommentsModel.aggregate(
	[ 
		{$sort:{createdAt: -1}},  
		{$skip:(page - 1) * limit}, 
		{$limit:limit*1},
		{
            $lookup:{ 
				from:'movies',
				let:{"movieId":"$movieId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
					{$project:{type:1,imdb_id:1,imdb_rating:1, 
						original_title:1,image_path:1,backdrop_path:1,
						runtime:1,release_date:1,genre:1,tmdb_id:1
					}},
				],
				as:'movieId' 
			} 
		},
		{
            $lookup:{
				from:'users',
				let:{"userId":"$userId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$userId"]}}},
					{$project:{firstname:1,lastname:1,mediaId:1}},  
						{
						$lookup:{
							from:'media',
							let:{"mediaId":"$mediaId"},
							pipeline:[
								{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
								{$project:{url:1}},
							],
							as:'mediaId'   
						}
					}
				],
				as:'userId'
			} 
		},
		{
            $lookup:{
				from:'commentlikes',
				localField:"_id",
				foreignField:'commentId', 
				as:'commentLikesCount'
			}, 
			
		}, 
		{
			$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
		},
		{
			$project:{
				reasonToBlock:true,movieId:true,isActive:true,
				isDeleted:true,userId:true,content:true,commentLikesCount:true
			} 
		},

		 
	],
	(err,response)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, response })
}) 
}



// exports.getAll = async (req, res) => {
// 	try { 
// 		const { page = 1, limit } = req.query;
// 		const response = await CommentsModel.find()
// 			.limit(limit * 1)
// 			.skip((page - 1) * limit)
// 			.sort({ createdAt: -1 })
			
// 			.populate({
// 				path:'userId',
// 				model:'user',
// 				select:'firstname lastname mediaId', 
// 				populate:{
// 					path:'mediaId',
// 					model:'media',
// 					select:'url'
// 				}
// 			})
// 			.populate('listId', 'name')
// 			.populate('movieId','image_path original_title release_date tmdb_id')
			
// 		const total = await CommentsModel.find().countDocuments();
// 		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
// 		res.json({ total: total, pages, status: 200, response });
// 	} catch (error) {
// 		res.status(500).json(error);
// 	}
// };

exports.create = async (req, res) => {
	const newComment = await new CommentsModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		listId: req.body.listId,
		isActive: req.body.isActive,
		movieId:req.body.movieId,
		reasonToBlock: req.body.reasonToBlock,
		isDeleted: req.body.isDeleted,
	});

	newComment
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New comment is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ data });
		}
	})
	.populate({
        path:'userId',
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
		.populate('listId', 'name')
		.populate('movieId','image_path original_title release_date tmdb_id')
};

exports.getCommentsByUserId = async (req, res) => {
	await CommentsModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
	.populate({ 
        path:'userId', 
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
	
		.populate('listId', 'name')
		.populate('movieId','image_path original_title release_date tmdb_id')
};

exports.getCommentsByList = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await CommentsModel.find({ listId: req.params.listid })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			
			.populate({
				path:'userId',
				model:'user',
				select:'firstname lastname mediaId',
				populate:{
					path:'mediaId',
					model:'media',
					select:'url'
				}
			})
			.populate('listId', 'name')
		
			
		const total = await CommentsModel.find({ listId: req.params.listid }).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}

};
exports.getCommentsByMovie = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await CommentsModel.find({ movieId: req.params.movieid })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			
			.populate({
				path:'userId',
				model:'user',
				select:'firstname lastname mediaId',
				populate:{
					path:'mediaId',
					model:'media',
					select:'url'
				}
			})
			.populate('movieId','image_path original_title release_date tmdb_id') 
		
			
		const total = await CommentsModel.find({ movieId: req.params.movieid }).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}

};









 

exports.updateComment = async (req, res) => {
	await CommentsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleComment = async (req, res) => {
	await CommentsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};
