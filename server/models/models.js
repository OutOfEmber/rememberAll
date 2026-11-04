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
const Type = sequelize.define('type',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique: true, allowNull: false},
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

User.hasOne(Basket)
Basket.belongsTo(User)

Coffee.hasOne(CoffeeInfo)
CoffeeInfo.belongsTo(Coffee)

Type.hasMany(Coffee)
Coffee.belongsTo(Type)

Basket.hasMany(BasketItems)
BasketItems.belongsTo(Basket)

module.exports = {
    User,
    Coffee,
    Type,
    CoffeeInfo,
    Basket,
    BasketItems
}
