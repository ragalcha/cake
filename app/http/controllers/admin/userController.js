const User = require('../../../models/user');

function userController() {
    return {
        // Fetch and display all users
        async index(req, res) {
            try {
                const users = await User.find();
                return res.render('admin/user/index', { users });
            } catch (err) {
                console.error(err);
                res.status(500).send('Error fetching users');
            }
        },

        // Render create user form
        create(req, res) {
            return res.render('admin/user/create');
        },

        // Store new user
        async store(req, res) {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/admin/user/create');
            }

            try {
                const user = new User({ name, email, password, role });
                await user.save();
                req.flash('success', 'User created successfully');
                return res.redirect('/admin/user');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Error creating user');
                return res.redirect('/admin/user/create');
            }
        },

        // Render edit user form
        async edit(req, res) {
            try {
                const user = await User.findById(req.params.id);
                if (!user) {
                    req.flash('error', 'User not found');
                    return res.redirect('/admin/user');
                }
                return res.render('admin/user/edit', { user });
            } catch (err) {
                console.error(err);
                res.status(500).send('Error fetching user');
            }
        },

        // Update user details
        async update(req, res) {
            const { name, email, role } = req.body;

            if (!name || !email) {
                req.flash('error', 'All fields are required');
                return res.redirect(`/admin/user/${req.params.id}/edit`);
            }

            try {
                const user = await User.findByIdAndUpdate(req.params.id, { name, email, role });
                if (!user) {
                    req.flash('error', 'User not found');
                    return res.redirect('/admin/user');
                }
                req.flash('success', 'User updated successfully');
                return res.redirect('/admin/user');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Error updating user');
                return res.redirect(`/admin/user/${req.params.id}/edit`);
            }
        },

        // Delete user
        async delete(req, res) {
            try {
                await User.findByIdAndDelete(req.params.id);
                req.flash('success', 'User deleted successfully');
                return res.redirect('/admin/user');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Error deleting user');
                return res.redirect('/admin/user');
            }
        }
    };
}

module.exports = userController;
