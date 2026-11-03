const {Coffee} = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')

class CoffeeController{
    async getAll(req,res,next){
        try{
        const coffies= await Coffee.findAll()
        
        return res.json(coffies)

        } catch (error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async getById(req,res,next){
        try{
            const coffeeId = await Coffee.findByPk(req.query)
            return res.json(coffeeId)
        } catch (error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async create(req, res, next) {
        try {
            const { name, price, info } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname,'..','static',fileName))

            const coffee = await Coffee.create({ name, price,img:fileName })
            return res.json(coffee)
            
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new CoffeeController()