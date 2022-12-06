const axios = require('axios')
const FormData = require('form-data');

const getEvents = async () => {
    try {
        const where = [{
            column: 'is_active',
            value: 1
        }]


        const res = await axios({
            url: 'https://qtickets.ru/api/rest/v1/events',
            method: 'GET',
            data: {
                where
            },
            headers: {
                'Authorization': process.env.QTICKETS_API
            }
        })
        return res.data.data
    } catch (e) {
        return null
    }
}

const createClient = async ({email, name, surname, vk_id}) => {
    try {
        const res = await axios.post('https://qtickets.ru/api/rest/v1/events', {
            data: {
                email,
                details: {
                    name,
                    surname,
                    vk_id
                }
            }

        }, {
            headers: {
                'Authorization': process.env.QTICKETS_API
            }
        })

        // return res.data.data
    } catch (e) {
        console.log(e)
        return null
    }
}

const getTickets = async (vk_id) => {
    try {
        const where = [{
            column: 'client.details.vk_id',
            value: vk_id,
        }]

        const res = await axios({
            url: 'https://qtickets.ru/api/rest/v1/orders?where=',
            method: 'GET',
            data: {
              where
            },
            headers: {
                where: JSON.stringify(where),
                'Authorization': process.env.QTICKETS_API
            }
        })
        return res.data.data
    } catch (e) {
        console.log(e)
        return null
    }
}

const getPhoto = async (url) => {
    try {
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
        })
        return res.data
    } catch (e) {
        console.log(e)
        return null
    }
}

const uploadPhoto = async (bits, url) => {
    try {
        const form = new FormData()
        form.append('photo', bits.photo_bits, {
            ...bits.file
        })
        const res = await axios.post(url, form, {
            'Content-Type': 'multipart/form-data'
        })
        return res.data
    } catch (e) {
        console.log(e)
        return null
    }
}

module.exports = {getEvents, createClient, getTickets, getPhoto, uploadPhoto}
