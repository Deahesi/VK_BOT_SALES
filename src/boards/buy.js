const VkBot = require('node-vk-bot-api');
const VkBotMarkup = require('node-vk-bot-api/lib/markup');

const buyE = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    CANCEL: '❌'
}

const buyLinkE = {
    BUY_ACCEPT: 'Подтвердить покупку'
}

const buyBoughtE = {
    BOUGHT: 'Оплачено'
}

const keyboard_buy = VkBotMarkup.keyboard([
    VkBotMarkup.button(buyE.ONE, 'positive'),
    VkBotMarkup.button(buyE.TWO, 'primary'),
    VkBotMarkup.button(buyE.THREE, 'primary'),
    VkBotMarkup.button(buyE.FOUR, 'primary'),
    VkBotMarkup.button(buyE.CANCEL, 'negative'),
])

const keyboard_link = VkBotMarkup.keyboard([
    VkBotMarkup.button(buyLinkE.BUY_ACCEPT, 'positive'),
    VkBotMarkup.button(buyE.CANCEL, 'negative'),
])

const keyboard_bought = VkBotMarkup.keyboard([
    VkBotMarkup.button(buyBoughtE.BOUGHT, 'positive'),
])

module.exports = {keyboard_buy, keyboard_link, keyboard_bought, buyE, buyLinkE, buyBoughtE}
