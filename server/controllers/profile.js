const renderError = require("../utils/renderError");
const prisma = require("../config/prisma");

exports.profile = async (req, res, next) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id},
      select: {
        id: true,
        email: true,
        username: true,
        firstname:true,
        lastname:true,
        picture:true,
        role:true,
        createdAt:true,
      },
    });
    res.json({result:user})
  } catch (error) {
    next(error);
  }
};


exports.listUser = async (req,res,next) => {
  try {
    const user = await prisma.user.findMany({
      select:{
        id:true,
        username:true,
        email:true,
        firstname:true,
        lastname:true,
        role:true,
        businessInfo:true
      }
    })
    res.json({success:true,user:user})
  } catch (error) {
    next(error)
  }
}