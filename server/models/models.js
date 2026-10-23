const sequelize = require('./db.js')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primarykey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})
const Coffee = sequelize.define('coffee',{
    id: {type: DataTypes.INTEGER, primarykey: true, autoIncrement: true},
    name:{type:DataTypes.STRING, unique: true, allowNull: false},
    img:{type:DataTypes.STRING, allowNull: false},
    price:{type:DataTypes.INTEGER, allowNull: false}
})
const CoffeeInfo = sequelize.define('coffeeInfo',{
    id: {type: DataTypes.INTEGER, primarykey: true, autoIncrement: true},
    title:{type:DataTypes.STRING, unique: true, allowNull: false},
    description:{type:DataTypes.STRING, allowNull: false}
})

Coffee.hasOne(CoffeeInfo)
CoffeeInfo.belongsTo(Coffee)