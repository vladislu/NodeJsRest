module.exports = (req, res, next) => {
    try{
        if(req.userData.role === 'admin') next();
        else return res.status(401).json({message: 'Authorization failed'});
    }catch(error){
        return res.status(401).json({message: 'Authorization failed'});
    }
};