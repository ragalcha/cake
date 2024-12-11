const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const menuController = require('../app/http/controllers/admin/menuController');
const menuRoutes = require("./menuRoutes.js");
const userRoutes = require('./userRoutes.js');
const { upload } = require("../app/http/middlewares/multer"); // For test upload route
// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')


function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)

    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

    // Admin User Routes
    app.use('/admin/user', admin, userRoutes);

    app.use("/admin/menu", menuRoutes);
     // File upload test route
     app.post("/test-upload", upload.single("image"), (req, res) => {
      if (!req.file) {
          return res.status(400).send({ error: "No file uploaded" });
      }
      res.status(200).send({
          message: "File uploaded successfully",
          file: req.file,
      });
  });
}

module.exports = initRoutes

