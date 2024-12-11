const Menu = require('../../models/menu')
function homeController() {
    return {
        async index(req, res) {
            // console.log('req.user', req.user || null);        
            const user = req.user || null;
            const pizzas = await Menu.find()
            return res.render('home', { pizzas: pizzas, user: user })
        }
    }
}

module.exports = homeController