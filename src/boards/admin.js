const VkBotMarkup = require('node-vk-bot-api/lib/markup');
const {AdminModel} = require('../models')

const adminAddE = {
    ADD_ADMIN: '1. Добавить администратора',
    DEL_ADMIN: '2. Удалить администратора',
    MESSAGE: '3. Разослать анонс',
    ADD_EVENT: '4. Создать мероприятие',
    CANCEL: '❌'
}

const adminDelE = {
    ADD_ADMIN: '1. Добавить администратора',
    DEL_ADMIN: '2. Удалить администратора',
    MESSAGE: '3. Разослать анонс',
    DEL_EVENT: '4. Удалить мероприятие',
    CHANGE_PRICE: '5. Изменить текущую цену',
    CANCEL: '❌'
}

const _keyboard_add = VkBotMarkup.keyboard([
    VkBotMarkup.button(adminAddE.ADD_ADMIN, 'positive'),
    VkBotMarkup.button(adminAddE.DEL_ADMIN, 'negative'),
    VkBotMarkup.button(adminAddE.MESSAGE, 'primary'),
    VkBotMarkup.button(adminAddE.ADD_EVENT, 'positive'),
    VkBotMarkup.button(adminAddE.CANCEL, 'negative')
], { columns: 1 })

// const _keyboard_del = VkBotMarkup.keyboard([
//     VkBotMarkup.button(adminAddE.ADD_ADMIN, 'positive'),
//     VkBotMarkup.button(adminAddE.DEL_ADMIN, 'negative'),
//     VkBotMarkup.button(adminAddE.MESSAGE, 'primary'),
//     VkBotMarkup.button(adminAddE.MESSAGE, 'primary'),
//     VkBotMarkup.button(adminAddE.DEL_EVENT, 'negative'),
//     VkBotMarkup.button(adminAddE.CANCEL, 'negative')
// ], { columns: 1 })

const keyboard = () => _keyboard_add

module.exports = {keyboard, adminAddE, adminDelE}
