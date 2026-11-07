const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')


class TypeController{
    async create(req, res, next) {
        try {
            let { name } = req.body
            const type = await Type.create({ name })
            
            
            return res.json(type)
            
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    async read(req,res,next){
        try{
            const types= await Type.findAndCountAll()
            
            return res.status(200).json(types)
    
        } catch (error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async update(req, res, next){
        try{
            const {id} = req.params
            const {name} = req.body
            const type = await Type.findOne({where:{id}})
            if(!type){
                return next(ApiError.badRequest(`Тип с id ${id} не найден`))
            }
            await Type.update(
                {name},
                {where: {id}}
            )
            return res.json(type)
        }catch(error){
            return next(ApiError.badRequest(error.message))
        }
    }
    async delete(req, res, next){
        try{
            const {id} = req.params
            const type = Type.findOne({where:{id}})
            if(!type){
                return next(ApiError.badRequest(`Тип с id ${id} не найден`))
            }
            await Type.destroy({where:{id}})
            return res.json({message:"Запись удалена"})
        }catch(error){
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new TypeController()