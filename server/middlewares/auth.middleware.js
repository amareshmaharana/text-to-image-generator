import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const {token} = req.headers;

    if(!token){
        return res.status(401).json({message: "Unauthorized access!! Please login again!!"})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        } else {
            return res.status(403).json({message: "Invalid token!! Please login again!!"})
        }

        next()
    } catch (error) {
        console.error("ERRROR :: ", error)
        return res.status(403).json({message: "Something went wrong!!"})
    }
}