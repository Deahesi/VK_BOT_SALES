const bwipjs = require('bwip-js');

const createBarCode = async (data) => {
    try {
        const png = await bwipjs.toBuffer({
            bcid: 'code128',
            text: data,
            scale:       3,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign:  'center',
            paddingwidth: 2
        })
        return png
    } catch (e) {
        console.log(e)
        return null
    }

}

module.exports = {createBarCode}
