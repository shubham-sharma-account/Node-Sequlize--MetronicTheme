const { User, UserSalary } = require('../users/user-model');
const { Op } = require("sequelize");

class Users {
    //creating new user
    async insert(myJson) {
        try {
            const data = await User.findOne({ where: { email: myJson.email } });
            if (data) {
                return 1;
            } else {
                await User.create(myJson);
                await UserSalary.create({ salary: myJson.salary, userEmail: myJson.email });
            }
        } catch (error) {
            console.log(error);
        }
    }

    //list all users
    async listUsers() {
        try {
            let result = await User.findAll({
                order: [
                    ['createdAt', 'desc']
                ]
            });
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //display users with their salaries
    async displaySalaries() {
        try {
            let result = User.findAll({
                include: [{
                    model: UserSalary,
                }]
            });
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error)
        }
    }

    //find user by id and render his/her data
    async getUserData(userid) {
        try {
            let user = await User.findAll({
                where: {
                    id: {
                        [Op.eq]: userid
                    }
                }
            });
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //edit user details
    async editUserData(req, res, next) {
        await User.update({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        }, {
            where: {
                id: req.body.id
            }
        }).then((data) => {
            if (data) {
                res.render('edit-user', { msg: 'Updated successfully' });
            } else {
                res.send('Error in updating data')
            }
        })
    }

    //delete user by id
    async deleteUser(id) {
        try {
            let data = await User.destroy({
                where: {
                    id: id
                }
            })
            return Promise.resolve(data)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    //count total users
    async countUsers() {
        let result = await User.findAndCountAll({});
        return result;
    }
}

module.exports = Users;