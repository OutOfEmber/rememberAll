const { CoffeeInfo } = require('../models/models')
const ApiError = require('../error/ApiError')

class CoffeeInfoController {
    async read(req, res, next) {
        try {
            const infos = await CoffeeInfo.findAndCountAll() 

            return res.status(200).json(infos) 
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { title, description } = req.body
            const info = await CoffeeInfo.findOne({ where: { id } })
            if (!info) {
                return next(ApiError.badRequest(`Info с id ${id} не найден`))
            }
            await CoffeeInfo.update(
                { title, description },
                { where: { id } }
            )
            return res.json({ message: "Запись успешно обновлена" })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    
    async delete(req, res, next) {
        try {
            const { id } = req.params
            const info = await CoffeeInfo.findOne({ where: { id } }) 
            if (!info) {
                return next(ApiError.badRequest(`Запись с id ${id} не найдена`))
            }
            await CoffeeInfo.destroy({ where: { id } })
            return res.json({ message: "Запись удалена" })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params
            const info = await CoffeeInfo.findOne({ where: { id } })
            return res.json(info)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new CoffeeInfoController()
