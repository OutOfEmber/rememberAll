const sequelize = require('../db.js')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})
const Coffee = sequelize.define('coffee',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique: true, allowNull: false},
    img:{type:DataTypes.STRING, allowNull: false},
    price:{type:DataTypes.INTEGER, allowNull: false}
})
const CoffeeInfo = sequelize.define('coffeeInfo',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type:DataTypes.STRING, unique: true, allowNull: false},
    description:{type:DataTypes.STRING, allowNull: false}
})
const Basket = sequelize.define('basket',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})
const BasketItems = sequelize.define('basketItems',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Coffee.hasOne(CoffeeInfo)
CoffeeInfo.belongsTo(Coffee)

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketItems)
BasketItems.belongsTo(Basket)

module.exports = {
    User,
    Coffee,
    CoffeeInfo,
    Basket,
    BasketItems
}
