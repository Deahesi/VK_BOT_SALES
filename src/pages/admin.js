const admin_board = require("../boards/admin");
const main_board = require("../boards/main");
const texts = require("../utils/texts");
const {sequelize, AdminModel} = require('../models')
const {page_names} = require("../actions");

const _validateAdmin = (ctx) => {
    if (!ctx.session.admin) {
        ctx.reply(texts.error, null, main_board.keyboard(ctx))
        ctx.session.page = page_names.MAIN;
        return true
    }
    return false
}

module.exports = {
    [admin_board.adminAddE.CANCEL]: async function (ctx) {
        if (_validateAdmin(ctx)) return

        ctx.reply(texts.cancel, null, main_board.keyboard(ctx));
        ctx.session.page = page_names.MAIN;
    },
    [admin_board.adminAddE.ADD_EVENT]: async function (ctx) {
        if (_validateAdmin(ctx)) return

        ctx.reply('https://qtickets.app/events', null, await admin_board.keyboard(ctx));
    },
    [admin_board.adminAddE.MESSAGE]: async function (ctx) {
        if (_validateAdmin(ctx)) return

        ctx.reply(texts.write_anonce, null, main_board.emptyBoard);
        ctx.session.free = true
        ctx.session.message = {}
        ctx.session.message.creating = true
        // ctx.session.event = {}
    },
    [admin_board.adminAddE.ADD_ADMIN]: async function (ctx) {
        if (_validateAdmin(ctx)) return

        ctx.reply(texts.write_admin_id, null, main_board.emptyBoard);
        ctx.session.free = true
        ctx.session.add_admin = true
    },
    [admin_board.adminAddE.DEL_ADMIN]: async function (ctx) {
        if (_validateAdmin(ctx)) return

        ctx.reply(texts.write_admin_id, null, main_board.emptyBoard);
        ctx.session.free = true
        ctx.session.del_admin = true
    },
    'FREE': async function (ctx, bot) {
        if (_validateAdmin(ctx)) return

        if (ctx.message.text === main_board.mainE.CANCEL) {
            //ОТМЕНА
            ctx.session.message = {}
            ctx.session.message.creating = false
            ctx.session.add_admin = false
            ctx.session.del_admin = false
            ctx.session.free = false
            ctx.reply(texts.cancel, null, await admin_board.keyboard(ctx));
            return
            //ОТМЕНА
        }

        //СОЗДАНИЕ АНОНСА
        if (ctx.session.message?.creating) {
            const text = ctx.message.text ?? null
            const images = ctx.message.attachments.filter((a) => {
                return a.type === 'photo'
            }).map((p) => `photo${p.photo.owner_id}_${p.photo.id}_${p.photo.access_key}`).join(',')

            ctx.reply(texts.anonce_sending, null, await admin_board.keyboard(ctx));
            const members = await bot.execute('groups.getMembers', {
                group_id: bot.settings.group_id,
                fields: ['can_write_private_message']
            })

            for (const member of members.items) {

                if (member.can_write_private_message) {
                    bot.sendMessage(member.id, text, images).catch((e) => {
                    })
                }

            }

            ctx.reply(texts.anonce_success, null, await admin_board.keyboard(ctx));


            ctx.session.message = {}
            ctx.session.free = false
        }

        if (ctx.session.add_admin) {
            const id = parseInt(ctx.message.text)
            if (!id) {
                ctx.reply(texts.id_error, null, main_board.emptyBoard);
                return
            } else {
                const [admin, created] = await AdminModel.findOrCreate({where: {vk_id: id}, defaults: {vk_id: id}})
                if (created)
                    ctx.reply(texts.add_admin_success, null, await admin_board.keyboard(ctx));
                else
                    ctx.reply(texts.admin_exist, null, await admin_board.keyboard(ctx));
            }


            ctx.session.add_admin = false
            ctx.session.free = false
        }
        if (ctx.session.del_admin) {
            const id = parseInt(ctx.message.text)
            if (id === ctx.message.peer_id) {
                ctx.reply(texts.self_delete_error, null, await admin_board.keyboard(ctx));
                ctx.session.del_admin = false
                ctx.session.free = false
                return
            }
            if (id === parseInt(process.env.MAIN_ADMIN)) {
                ctx.reply(texts.forbidden, null, await admin_board.keyboard(ctx));
                ctx.session.del_admin = false
                ctx.session.free = false
                return
            }

            if (!id) {
                ctx.reply(texts.id_error, null, main_board.emptyBoard);
                return
            } else {
                await AdminModel.destroy({where: {vk_id: id}})
                ctx.reply(texts.del_admin_success, null, await admin_board.keyboard(ctx));
            }


            ctx.session.del_admin = false
            ctx.session.free = false
        }
    }
}
