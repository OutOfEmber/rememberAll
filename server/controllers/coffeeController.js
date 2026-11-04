const {Coffee, CoffeeInfo} = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const apiError = require('../error/ApiError')

class CoffeeController{
    async create(req, res, next) {
        try {
            let { name, price, typeId, info } = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname,'..','static',fileName))
            const coffee = await Coffee.create({ name, price, typeId, img:fileName })
            
            if(info){
                info = JSON.parse(info)
                info.forEach(i => {
                    CoffeInfo.create({
                        title: i.title,
                        description: i.description,
                        coffeeId: coffee.id
                    })
                });
            }
            
            return res.json(coffee)
            
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    async read(req,res,next){
        try{
            let { typeId, limit, page } = req.query
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            let coffies;
            if(!typeId){
                coffies= await Coffee.findAndCountAll({limit , offset})
            }
            if(typeId){
                coffies= await Coffee.findAndCountAll({where:{typeId}, limit , offset})
            }
    
            
            return res.status(200).json(coffies)
            
        } catch (error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async update(req, res, next){
        try{
            const {id} = req.params
            const {name, img, price} = req.body
            const coffee = await Coffee.findOne({where:{id}})
            if(!coffee){
                return next(ApiError.badRequest(`Кофе с id ${id} не найден`))
            }
            await Coffee.update(
                {name,img,price},
                {where: {id}}
            )
            return res.json(coffee)
        }catch(error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async delete(req, res, next){
        try{
            const {id} = req.params
            const coffee = Coffee.findOne({where:{id}})
            if(!coffee){
                return next(ApiError.badRequest(`Кофе с id ${id} не найден`))
            }
            await Coffee.destroy({where:{id}})
            return res.json({message:"Запись удалена"})
        }catch(error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async getById(req,res,next){
        try{
            const {id} = req.params
            const coffee = await Coffee.findOne(
                {where: {id},
                include: [{model:CoffeeInfo}]
            }
            
        )
        return res.json(coffee)
    } catch (error){
        return next(ApiError.badRequest(error.message))
    }
    }
}

module.exports = new CoffeeController()