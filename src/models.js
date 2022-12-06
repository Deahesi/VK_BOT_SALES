const sqlite3 = require('sqlite3');
const { Sequelize, DataTypes } = require('sequelize');
new sqlite3.Database('./era.db', sqlite3.OPEN_READWRITE)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './era.db'
});

const AdminModel = sequelize.define('Admin', {
    vk_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
})

const EventModel = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const TicketModel = sequelize.define('Tickets', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = {sequelize, AdminModel, EventModel, TicketModel}
