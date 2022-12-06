const {sequelize, AdminModel} = require('../models')


module.exports = function () {
    return async (ctx, next) => {
        if (ctx.message.state === 'typing') return

        const admin = await AdminModel.findOne({ where: { vk_id: ctx.message.peer_id || -1 } })
        ctx.session.admin = Boolean(admin)
        // ctx.session.free = false
        // ctx.session.admin = false
        next()
    }
}
