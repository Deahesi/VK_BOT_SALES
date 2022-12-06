const texts = require("./src/utils/texts");
require('dotenv').config({path: '.' + process.env.NODE_ENV + '.env'})
const VkBot = require('node-vk-bot-api');
const Session = require('node-vk-bot-api/lib/session');
const main_board = require("./src/boards/main");
const {actions} = require("./src/actions");
const admin_middleware = require("./src/middlewares/admin");
const {sequelize, EventModel, AdminModel, TicketModel} = require('./src/models')
const page_names = require('./src/page_names')
const runInCluster = require('./src/utils/runInCluster')

const session = new Session();

const bot = new VkBot(process.env.VK_API);
bot.use(session.middleware());
bot.use(admin_middleware());

bot.command('/start', (ctx) => {
    ctx.reply(texts.start, null, main_board.keyboard(ctx))
});
bot.command('Начать', (ctx) => {
    ctx.reply(texts.start, null, main_board.keyboard(ctx))
});

const off = require('./src/utils/off')
bot.on(async (ctx) => {
    if (off.off) {
        return
    }
    try {
        const member = await bot.execute('groups.isMember', {
            group_id: bot.settings.group_id,
            user_id: ctx.message.peer_id
        })
        if (!member) {
            ctx.reply(texts.start_subscribe, null, null)
            return
        }

        if (ctx.message.text === '❌' && !ctx.session.free) {
            ctx.session.page = page_names.MAIN
            ctx.session.free = false
            ctx.reply(texts.start, null, main_board.keyboard(ctx))
            return
        }
        await actions(ctx, bot)
    } catch (e) {
        console.log(e)
        ctx.reply(texts.error)
    }

});


runInCluster(function () {
    sequelize.authenticate().then(() => {
        EventModel.sync();
        AdminModel.sync();
        TicketModel.sync();
        AdminModel.findOrCreate({
            where: {vk_id: parseInt(process.env.MAIN_ADMIN)},
            defaults: {vk_id: parseInt(process.env.MAIN_ADMIN)}
        })
        bot.startPolling();
    })
})



