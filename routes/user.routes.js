const authVerify = require("../middlewares/jwt.middleware")

const router=require("express").Router()

router.get("/",(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"profile route"
    })
})

router.get("/getmyitem",authVerify,)