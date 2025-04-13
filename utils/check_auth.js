var userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
module.exports = {
    check_authentication: async function (req, res, next) {
        let token;
        if (!req.headers || !req.headers.authorization) {
            token = req.signedCookies.token;
        } else {
            let authorizedtoken = req.headers.authorization;
            console.log(authorizedtoken);
            if (authorizedtoken.startsWith("Bearer")) {
                token = authorizedtoken.split(" ")[1];
                console.log(token);
            } 
        }
        if (!token) {
            next(new Error("Bạn chưa đăng nhập"));
        } else {
            let result = jwt.verify(token, constants.SECRET_KEY);
            if (result.exp > Date.now()) {
                let user = await userController.GetUserByID(result.id);
                req.user = user;
                console.log(user);
                next();
            } else {
                next(new Error("Bạn chưa đăng nhập"));
            }
        }
    },

    check_authorization: function (requiredRole) {
        return function (req, res, next) {
            let userRole = req.user.role.name;
            if (!requiredRole.includes(userRole)) {
                next(new Error("Không có quyền truy cập"));
            } else {
                next()
            }
        }
    }
}