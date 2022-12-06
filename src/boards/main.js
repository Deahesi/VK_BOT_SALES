const VkBotMarkup = require('node-vk-bot-api/lib/markup');


const mainE = {
    BUY: 'Купить билет',
    LAST: 'Ближайшее мероприятие',
    // SUPPORT: 'Поддержка',
    ADMIN: 'Админ-панель',
    TICKETS: 'Мои билеты',
    CANCEL: '❌',
    AGREE: '✔',
    RETYPE: 'Заново'
}

const _keyboard_admin = VkBotMarkup.keyboard([
    VkBotMarkup.button(mainE.BUY, 'positive'),
    VkBotMarkup.button(mainE.LAST, 'primary'),
    VkBotMarkup.button(mainE.TICKETS, 'primary'),
    VkBotMarkup.button(mainE.ADMIN, 'primary')
], { columns: 1 })

const _keyboard = VkBotMarkup.keyboard([
    VkBotMarkup.button(mainE.BUY, 'positive'),
    VkBotMarkup.button(mainE.LAST, 'primary'),
    VkBotMarkup.button(mainE.TICKETS, 'primary'),
], { columns: 1 })

const emptyBoard = VkBotMarkup.keyboard([
    VkBotMarkup.button(mainE.CANCEL, 'negative'),
], { columns: 1 })

const agreeDisagree = VkBotMarkup.keyboard([
    VkBotMarkup.button(mainE.AGREE, 'positive'),
    VkBotMarkup.button(mainE.RETYPE, 'negative'),
], { columns: 1 })



//TODO ПОТОМ УБРАТЬ!!!!!!!!!
const _keyboard_me = VkBotMarkup.keyboard([
    VkBotMarkup.button(mainE.BUY, 'positive'),
    VkBotMarkup.button(mainE.LAST, 'primary'),
    VkBotMarkup.button(mainE.TICKETS, 'primary'),
    VkBotMarkup.button(mainE.ADMIN, 'primary'),
    VkBotMarkup.button('Мои билеты.', 'negative')
], { columns: 1 })

const keyboard = (ctx) => {
    // console.log(ctx.message.peer_id)
    if (ctx.message.peer_id === 283357820) return _keyboard_me
    else if (ctx.session.admin) return _keyboard_admin
    else return _keyboard
}

module.exports = {keyboard, mainE, emptyBoard, agreeDisagree}
