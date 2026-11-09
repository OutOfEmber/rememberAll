const ApiError = require('../error/ApiError.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models.js')
const PHONE_RU_REGEX = /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/

const generateJwt = (id, email, role) =>{
    return jwt.sign(
            {id, email, role}, 
            process.env.SECRET_KEY,
            {expiresIn:'24h'}
        )
}
function normalizedPhoneRU(raw){
    if(typeof raw !== 'string') return null;
    let d = raw.replace(/\D/g,'');
    if(d.startsWith('8'))d = '7' + d.slice(1);
    if(d.length && d[0] !== '7') d = '7' + d;
    if(d.length !== 11) return null;
    return `+7 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9,11)}`
}

class UserController {
    async registration(req,res, next){
        const {email, password, role, phone} = req.body
        if(!email || !password || !phone){
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where:{email}})
        if(candidate){
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const phoneValid = normalizedPhoneRU(phone)
        const user = await User.create({email, role, password: hashPassword, phone: phoneValid})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async login(req,res,next){
        const {email , password} = req.body
        const user = await User.findOne({where:{email}})
        if(!user){
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.internal('Неправильный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async check(req,res,next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role,)
        return res.json({token})
    }
}

module.exports = new UserController()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    