const fetchDataFromEndpoint = require('./fetchDataTest');

(async () => {
    try {
        const jsonData = await fetchDataFromEndpoint();
        if (jsonData) {
            console.log('Pobrane dane:', jsonData);
        } else {
            console.log('Nie udało się pobrać danych.');
        }
    } catch (error) {
        console.error('Błąd:', error);
    }
})();
