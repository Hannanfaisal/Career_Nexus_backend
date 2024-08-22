const axios = require("axios")


const ZOOM_API_URL = 'https://api.zoom.us/v2/users/me/meetings';

const interviewController = {

    async create(req, res) {
        const meetingData = req.body;

        try {
            const response = await axios.post(ZOOM_API_URL, meetingData, {

                headers: {
                    'Authorization': `Bearer ${req.cookies.zoomToken}`,
                    'Content-Type': 'application/json',
                },
            });
             res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).send(error.message);
        }
    }


}

module.exports = interviewController;