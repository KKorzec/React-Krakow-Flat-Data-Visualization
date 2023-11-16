const axios = require('axios');

async function fetchDataFromEndpoint() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/record/olx/1_0');
        return response.data;
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        return null;
    }
}

module.exports = fetchDataFromEndpoint;
