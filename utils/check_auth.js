// var userController = require('../controllers/users')
// let jwt = require('jsonwebtoken')
// let constants = require('../utils/constants')
// module.exports = {
//     check_authentication: async function (req, res, next) {
//         let token;
//         if (!req.headers || !req.headers.authorization) {
//             token = req.signedCookies.token;
//         } else {
//             let authorizedtoken = req.headers.authorization;
//             if (!authorizedtoken.startsWith("Bearer")) {
//                 token = authorizedtoken.split(" ")[1];
//             } 
//         }
//         if (!token) {
//             next(new Error("ban chua dang nhap"));
//         } else {
//             let result = jwt.verify(token, constants.SECRET_KEY);
//             if (result.exp > Date.now()) {
//                 let user = await userController.GetUserByID(result.id);
//                 req.user = user;
//                 next();
//             } else {
//                 next(new Error("ban chua dang nhap"));
//             }
//         }
//     },
//     check_authorization: function (requiredRole) {
//         return function (req, res, next) {
//             let userRole = req.user.role.name;
//             if (!requiredRole.includes(userRole)) {
//                 next(new Error("ban khong co quyen"));
//             } else {
//                 next()
//             }
//         }
//     }
// }
let jwt = require('jsonwebtoken');
let userController = require('../controllers/users');
let constants = require('../utils/constants');

module.exports = {
  check_authentication: async function (req, res, next) {
    try {
      let token;

      // Ưu tiên lấy từ header Authorization
      if (req.headers && req.headers.authorization) {
        let authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      // Nếu không có, thử lấy từ cookie
      if (!token && req.signedCookies && req.signedCookies.token) {
        token = req.signedCookies.token;
      }

      if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập" });
      }

      let result = jwt.verify(token, constants.SECRET_KEY);

      // ✅ So sánh đúng định dạng thời gian (giây → mili giây)
      if (result.exp * 1000 < Date.now()) {
        return res.status(401).json({ message: "Token đã hết hạn" });
      }

      let user = await userController.GetUserByID(result.id || result._id); // _id thường dùng hơn
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      
      

      req.user = user;
      next();
    } catch (err) {
      console.error("Lỗi xác thực:", err.message);
      return res.status(500).json({ message: "Lỗi xác thực", error: err.message });
    }
  },

  check_authorization: function (requiredRoles) {
    return function (req, res, next) {
      let userRole = req.user?.role?.name;
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: "Bạn không có quyền" });
      } else {
        next();
      }
    };
  },
};
