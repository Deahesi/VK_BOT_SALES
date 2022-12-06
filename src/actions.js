const main = require('./pages/main')
const admin = require('./pages/admin')
const page_names = require('./page_names')

const _pages = {
    [page_names.MAIN]: main,
    [page_names.ADMIN]: admin
}

const actions = async (ctx, bot) => {
    return await _pages[ctx.session.page ?? page_names.MAIN][ctx.session.free ? 'FREE' : ctx.message.text](ctx, bot)
}

module.exports = {actions}
