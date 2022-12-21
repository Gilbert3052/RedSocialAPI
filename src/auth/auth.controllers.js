const uuid = require('uuid')
const { findUserByEmail, updateUser } = require('../users/users.controllers')
const { comparePassword, hashPassword } = require('../utils/crypto')

const RecoveryPassword = require('../models/recoveryPasswords.models')

const checkUsersCredentials = async (email, password) => {
    try {
        const user = await findUserByEmail(email)
        const verifyPassword = comparePassword(password, user.password)
        if(verifyPassword){
            return user
        } 
        return null
    } catch (error) {
        return null
    }
}

const createRecoveryToken = async (email) => {
    try {
        const user = await findUserByEmail(email)
        const data = await RecoveryPassword.create({
            id: uuid.v4(),
            userId : user.id
        })
        return data
    } catch (error) {
        return error
    } 
} 

const changePassword = async (id, password) => {
    const recovery = await RecoveryPassword.findOne({
        where: {id: id, used: false}
    })
    console.log(recovery)
    if(recovery){
        await recovery.update({used: true})
        const data = await updateUser(recovery.userId, {
            password: hashPassword(password)
        })
        return data
    }
    return false
}

//? https://ejemplo.com/api/v1/auth/recovery-password/s6df51s3ad1f3sad5f43sd54f3sd54f3sad2f13sad4f

module.exports = {
    checkUsersCredentials,
    createRecoveryToken,
    changePassword
}