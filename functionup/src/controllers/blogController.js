const AuthorModel = require("../models/AuthorModel")
const blogModel = require("../models/blogModel")


const isValid = function (x) {
    if (typeof x === 'undefined' || x === null) return false
    if (typeof x === 'string' && x.trim().length === 0) return false
}

const isValidBody = function (y) {
    return Object.keys(y).length > 0
}

//=======================================(API 2)======================================


const createBlog = async function (req, res) {
    try {
        let data = req.body
        console.log(data)
        if(data.isPublished==true){data[`publishedAt`] = new Date()}
        let create = await blogModel.create(data)
        return res.status(201).send({ status: "true", data: create })
    }
    catch (error) {
        console.log("This is the error :", error.message)
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}


//=======================================(API 3)======================================


const getBlog = async function (req, res) {
    let query = req.query
    try {
        if (Object.keys(req.query).length == 0) {
            let allBlogs = await blogModel.find({ isPublished: "true", isDeleted: "false" })
            if (!allBlogs) return res.status(404).send({ status: "false", msg: "No Document found", })
            return res.status(200).send({ status: "true", data: allBlogs })
        }
        else {
            let Blogs = await blogModel.find({$and: [{ isPublished: "true" }, { isDeleted: "false" }], $or: [query]})
            if (!Blogs || Blogs.length == 0) return res.status(404).send({ status: "false", msg: "No Document found", })
            return res.status(200).send({ status: "true", data: Blogs })
        }
    }
    catch (error) {
        console.log("This is the error :", error.message)
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}



//=======================================(API 4)======================================


const updateBlog = async function (req, res) {
    try {
        let data = req.body
        if (!isValidBody(data)){ return res.status(400).send({status:"false", msg:"update needs data in body"})}

        let blogId = await blogModel.findById(req.params.blogId)
        if (!blogId) return res.status(404).send({ status: false, msg: "No such User Exits" })

        if (req.body.tags ) {
            var tagsData= blogId.tags
            var swap =tagsData.push((req.body.tags).toString())
            data[`tags`]= tagsData
        
        
            }

        if (req.body.category ) {
        var categoryData= blogId.category
        var swap =categoryData.push((req.body.category).toString())
        data[`category`]= categoryData
        // let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
        // return res.status(200).send({ status: true, msg: updateData })
        }

        if (req.body.subcategory ) {
        var subcategoryData=blogId.subcategory
        var swap2 =subcategoryData.push((req.body.subcategory).toString())
        data[`subcategory`]= subcategoryData
        }

        if (!blogId.isDeleted == false) {
           return res.status(404).send({ status: false, msg: "User is not Present / it's a deleted User" })
        }
        if(data.isPublished==true){
        data[`isPublished`] = true
        data[`publishedAt`] = new Date();}
        
        let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true })
        return res.status(200).send({ status: true, msg: updateData })

    }

    catch (error) {
        console.log("This is the Error2", error.message)
    return res.status(500).send({ msg: "Error", error: error.message })
    }

}


//=======================================(API 5)======================================


const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId
        let blogisDeletedOrNot = await blogModel.findById(blogId)
        if (!blogisDeletedOrNot.isDeleted == false) {
        return res.status(404).send({ status: false, msg: "User is not Present / it's a deleted User" })
        }
        const blog = await blogModel.findByIdAndUpdate(blogId, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (!blog) return res.status(404).send({ status: false, msg: "Blog Id is not Exist" })
        console.log("Successfully Deleted")
        return res.status(200).send()
    }

    catch (err) {
    return  res.status(500).send({ status: false, error: err.message })
    }

}


//=======================================(API 6)======================================


const deleteBlogByParams = async function (req, res) {
    try {
        let query= req.query
        const authorId = req.query.authorId
        const category = req.query.category
        const tags = req.query.tags
        const subcategory = req.query.subcategory
        const unpublished = req.query.isPublished
        const blogisDeletedOrNot = await blogModel.findOne({ authorId: authorId, category: category, tags: tags, subcategory: subcategory, isPublished: unpublished })
        //const blogisDeletedOrNot = await blogModel.findOne(query)   // Optional 
        
        if (!blogisDeletedOrNot) return res.status(404).send({ Status: "false", msg: "Not Matching Information Found With This" })
        if (!blogisDeletedOrNot.isDeleted == false) {
            return res.status(404).send({ status: false, msg: "User is not Present / it's a deleted User" })
        }
        const findForDelete = await blogModel.findOneAndUpdate({ authorId: authorId, category: category, tags: tags, subcategory: subcategory, isPublished: unpublished }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(201).send({ Msg: findForDelete })

    }
    catch (error) {
        console.log("This is the Error", error.message)
       return res.status(500).send({ msg: "Error", error: error.message })
    }

}




module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogByParams = deleteBlogByParams
module.exports.deleteBlog = deleteBlog