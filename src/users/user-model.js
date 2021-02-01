const connection = require('../../connection');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class User extends Model { }
//User model
User.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageurl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip: {
        type: Sequelize.STRING,
        allowNull: false
    },
    otp: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize: connection,
    modelName: 'User',
    timestamps: true
});

//UserSalary model
class UserSalary extends Model { }

UserSalary.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    salary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        foreignKey: true
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize: connection,
    modelName: 'UserSalary',
    timestamps: true
});

User.hasOne(UserSalary, {foreignKey: 'userEmail'}, {allowNull: false});

UserSalary.belongsTo(User, {foreignKey: 'email'});

/* (async ()=>{
    await connection.sync({force: true});
})(); */

module.exports = { User, UserSalary };