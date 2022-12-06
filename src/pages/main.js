const VkBotMarkup = require('node-vk-bot-api/lib/markup');
const main_board = require("../boards/main");
const admin_board = require("../boards/admin");
const buy_board = require("../boards/buy");
const {EventModel, TicketModel} = require('../models')
const page_names = require('../page_names')
const api = require('../api/api')
const barcodes = require('../utils/barcodes')
const {sequelize, AdminModel} = require('../models')
const texts = require('../utils/texts')

async function _getEvents(ctx) {
    ctx.reply(texts.loading);
    const events = await api.getEvents()
    if (!events.length) {
        ctx.session.events_now = []
        ctx.reply(texts.no_events, null, main_board.keyboard(ctx));
        return null
    }
    ctx.session.events_now = events
    const btns = []
    for (const event of events) {
        const date_arr = new Date(event.shows[0].start_date).toLocaleDateString('ru-RU', { timeZone: 'Asia/Novosibirsk' }).split('.')
        btns.push(VkBotMarkup.button(`${date_arr[0]}.${date_arr[1]}`, 'secondary'))
    }
    return VkBotMarkup.keyboard(btns)
}

async function _uploadPhotoToVk(ctx, bot, photo_bits, content_type, name) {
    const {upload_url} = await bot.execute('photos.getMessagesUploadServer', {
        peer_id: ctx.message.peer_id,
        group_id: bot.settings.group_id
    })

    const res_upload = await api.uploadPhoto({
        photo_bits,
        file: {
            filename: name + '.' + content_type.split('/')[1],
            contentType: content_type
        }
    }, upload_url)

    const res = await bot.execute('photos.saveMessagesPhoto', {
        photo: res_upload.photo,
        server: res_upload.server,
        hash: res_upload.hash,
    })

    return {photo_id: res[0].id, owner_id: res[0].owner_id, access_key: res[0].access_key}
}

async function _uploadPhotoToVkFromQ(ctx, bot, photo) {
    ctx.reply(texts.loading);
    const {upload_url} = await bot.execute('photos.getMessagesUploadServer', {
        peer_id: ctx.message.peer_id,
        group_id: bot.settings.group_id
    })


    const photo_bits = await api.getPhoto(photo.url)


    return await _uploadPhotoToVk(ctx, bot, photo_bits, photo.content_type, photo.id)
}

const off = require('../utils/off')


module.exports = {
    // //TODO УБРАТЬ ПОТОМ!!!!
    // ['Мои билеты.']: async function (ctx) {
    //     // ctx.reply('')
    //     if (ctx.message.peer_id !== 283357820) {
    //         return
    //     }
    //     off.turnOff()
    // },
    [main_board.mainE.BUY]: async function (ctx) {
        // const events_keyboard = await _getEvents(ctx)

        ctx.reply(texts.after_buy(process.env.QTICKETS_APP), null, await main_board.keyboard(ctx))
        // ctx.session.free = true
        // ctx.session.buy = {}
        // ctx.session.buy.b1 = true
    },
    [main_board.mainE.ADMIN]: async function (ctx) {
        if (ctx.session.admin) {
            ctx.reply(texts.to_admin, null, await admin_board.keyboard(ctx));
            ctx.session.page = page_names.ADMIN;
        } else {
            ctx.reply(texts.error)
        }

        // ctx.session.buy_state = true;
    },
    [main_board.mainE.LAST]: async function (ctx) {
        const events_keyboard = await _getEvents(ctx)
        if (events_keyboard) {
            ctx.reply(texts.prepare_events, null, events_keyboard);
            ctx.session.free = true
            ctx.session.view_events = true
        }
    },
    [main_board.mainE.TICKETS]: async function (ctx, bot) {
        // const events_keyboard = await _getEvents(ctx)
        await ctx.reply(texts.loading, null, main_board.keyboard(ctx));
        const events = (await api.getEvents()).filter((e) => e.is_active === 1)
        if (!events.length) {
            ctx.session.events_now = []
            ctx.reply(texts.no_events, null, main_board.keyboard(ctx));
            return
        }

        const tickets = (await api.getTickets(ctx.message.peer_id)).filter((t) => events.find((e) => e.id === t.event_id))
        if (!tickets.length) {
            ctx.reply(texts.no_tickets, null, main_board.keyboard(ctx));
            return
        }


        for (const ticket of tickets) {
            const event = events.find((e) => e.id === ticket.event_id)
            if (!event) continue;
            const date_arr = new Date(event.shows[0].start_date).toLocaleDateString('ru-RU', { timeZone: 'Asia/Novosibirsk' }).split('.')

            if (ticket.payed) {
                for (const basket of ticket.baskets) {
                    let ticket = await TicketModel.findByPk(basket.id)
                    if (!ticket) {
                        const barcode = await barcodes.createBarCode(basket.barcode)
                        const photo = await _uploadPhotoToVk(ctx, bot, barcode, 'image/png', basket.id)
                        ticket = await TicketModel.create({ id: basket.id, photo: 'photo' + photo.owner_id + '_' + photo.photo_id + '_' + photo.access_key })
                    }
                    await ctx.reply(texts.show_ticket(new Date(event.shows[0].start_date).toLocaleDateString('ru-RU', { timeZone: 'Asia/Novosibirsk' }), basket.seat_name, basket.barcode), ticket.photo, main_board.keyboard(ctx))
                }
            } else {

                await ctx.reply(texts.isnt_payed(new Date(event.shows[0].start_date).toLocaleDateString('ru-RU', { timeZone: 'Asia/Novosibirsk' }), ticket.payment_url), null, main_board.keyboard(ctx))
            }


        }
    },
    'FREE': async function (ctx, bot) {
        if (ctx.message.text === main_board.mainE.CANCEL) {
            //ОТМЕНА
            ctx.session.view_events = false
            ctx.session.buy = {}
            ctx.session.free = false
            ctx.reply(texts.cancel, null, main_board.keyboard(ctx));
            return
            //ОТМЕНА
        }


        if (ctx.session.view_events) {
            const event = ctx.session.events_now.find((e) => {
                const date_arr = new Date(e.shows[0].start_date).toLocaleDateString('ru-RU', { timeZone: 'Asia/Novosibirsk' }).split('.')
                return `${date_arr[0]}.${date_arr[1]}` === ctx.message.text
            })
            if (event) {
                let photo = await EventModel.findByPk(event.id)
                if (!photo) {
                    const data = await _uploadPhotoToVkFromQ(ctx, bot, event.poster)
                    if (!data) return
                    photo = await EventModel.create({
                        id: event.id,
                        photo: 'photo' + data.owner_id + '_' + data.photo_id + '_' + data.access_key
                    })
                }
                ctx.reply(event.description, photo.photo, main_board.keyboard(ctx))
            } else {
                ctx.reply(texts.incorrect_date, null, main_board.keyboard(ctx));
            }

            ctx.session.free = false
            ctx.session.view_events = false
        }
    }
}
