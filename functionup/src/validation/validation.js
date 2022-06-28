const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');

let userCheck = /^[a-zA-Z\-]+$/;
let mailRegex = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
let validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const isValidObjectId = function (x) {            // Check mongo Id 
    return mongoose.Types.ObjectId.isValid(x)
}

//====================================================================================
//                        The Validation Of Create Author Schema
//                                    (API - 1)

const createAuthMid = async function (req, res, next) {
    try {
        let title = req.body.title
        if (typeof (title) != 'string' || !title) return res.status(404).send({ msg: " title is required " })
        if (title == "Mr" || title == "Mrs" || title == "Miss") { title = title }
        else
            return res.status(400).send({ msg: "title must be Mr/Mrs/Miss" })


        let firstName = req.body.fname
        if (typeof (firstName) != 'string' || !firstName) return res.status(404).send({ msg: "first Name is required " })
        if (!firstName.match(userCheck)) return res.status(400).send({ msg: "first Name is not valid " })

        let lastName = req.body.lname
        if (typeof (lastName) != 'string' || !lastName) return res.status(404).send({ msg: "last Name is required " })
        if (!lastName.match(userCheck)) return res.status(400).send({ msg: "last Name is not valid " })

        let data = req.body;

        let email = req.body.email
        if (typeof (email) != 'string' || !email) return res.status(403).send({ msg: "email is required" })
        if (!email.match(mailRegex)) return res.status(400).send({ msg: "email is not valid" })

        let password = req.body.password
        if (typeof (password) != 'string' || !password) return res.status(403).send({ msg: "password is required" })
        if (!password.match(validPassword)) return res.status(400).send({ msg: "Password is not valid. Must be contain 1 UpperCase alphabet and minimum 8 elements and not allowed special character" })


        const autherMail = await AuthorModel.findOne({ email: data.email }); //email exist or not
        if (autherMail) { return res.status(404).send({ status: false, msg: "Email already exist" }); }

        next()
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }

}


//====================================================================================
//                          The Validation Of Blog Model Schema
//                                    (API - 2)

const blogSchemaValidation = async function (req, res, next) {
    try {
        let title = req.body.title
        if (typeof (title) != 'string' || !title) return res.status(400).send({ msg: "title is need to be given" })

        let body = req.body.body
        if (typeof (body) != 'string' || !body) return res.status(400).send({ msg: "body is need to be given" })

        let authorId = req.body.authorId
        if (typeof (authorId) != 'string' || !authorId) return res.status(400).send({ msg: "authorId is need to be given" })
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "invalid authorId" })

        let category = req.body.category
        if (!category) return res.status(400).send({ status: false, msg: "category is need to required" })
        length = category.length
        if (length == 0) return res.status(400).send({ msg: "category is need to be given" })

        let subcategory = req.body.subcategory
        if(subcategory){
        length = subcategory.length
        if (length == 0) return res.status(400).send({ msg: "subcategory is need to be given" })
        }
        next()
    } catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


//====================================================================================
//                               The Blog Id Validation
//                                    (API - 4 & 5)


const blogIdValidation = async function (req, res, next) {
    try {
        let blogId = req.params.blogId
        if (!blogId) return res.status(400).send({ msg: "blogId is need to be given" })

        if (blogId.length != 24) return res.status(400).send({ status: false, msg: "invalid blogId" })
        else {
            let isblog = await blogModel.findById(blogId)
            if (!isblog) return res.status(400).send({ status: false, msg: "No such user exists" })
        }
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


//====================================================================================

//                          The ValiDation of Param queries attribute
//                                         (API - 6)


const deleteByParMid = async function (req, res, next) {
    try {
        const authorId = req.query.authorId
        const category = req.query.category
        const tags = req.query.tags
        const subcategory = req.query.subcategory
        const unpublished = req.query.isPublished
        if (!authorId) return res.status(400).send({ status: false, msg: "authorId is not given" })
        if (!category) return res.status(400).send({ status: false, msg: "category is not given" })
        if (!tags) return res.status(400).send({ status: false, msg: "tags is not given" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is not given" })
        if (!unpublished) return res.status(400).send({ status: false, msg: "unpublished is not given" })
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


//======================================================================================================
//                        The validation of Email-Id & Password 
//                                      ( API - 2.1 )


const checkEmailandPassword = async function (req, res, next) {
    try {

        let email = req.body.emailId;
        let password = req.body.password;
        if (!email) return res.status(400).send({ status: false, msg: "Email-Id is required" });
        if (!email.match(mailRegex)) return res.status(400).send({ msg: "Email-Id is not valid" })

         if (!password) return res.status(400).send({ status: false, msg: "Password is required" });
         if (!password.match(validPassword)) return res.status(400).send({ msg: "Password is not valid. Must be contain 1 UpperCase alphabet and minimum 8 elements and not allowed special character" })
        next()
    }
    catch (error) {
        console.log("This is the error :", error.message)
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}



module.exports.blogIdValidation = blogIdValidation
module.exports.blogSchemaValidation = blogSchemaValidation
module.exports.createAuthMid = createAuthMid
module.exports.deleteByParMid = deleteByParMid
module.exports.checkEmailandPassword = checkEmailandPassword