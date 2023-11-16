import React, { useState, useEffect } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import distData from './../data/krakow-districts.json';
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";

const MapComponent = () => {
    const [selectedEndpoint, setSelectedEndpoint] = useState('olx/1_0');
    const [endpointData, setEndpointData] = useState(null);
    const [layers, setLayers] = useState({});
    const [priceRanges, setPriceRanges] = useState({
        'olx/1_0': { min: 1800, max: 2400 },
        'olx/1_30': { min: 1800, max: 2400 },
        'olx/1_60': { min: 1800, max: 2400 },
        'olx/2_0': { min: 2400, max: 3300 },
        'olx/2_30': { min: 2400, max: 3300 },
        'olx/2_60': { min: 2400, max: 3300 },
        'olx/3_0': { min: 2800, max: 4500 },
        'olx/3_30': { min: 2800, max: 4500 },
        'olx/3_60': { min: 2800, max: 4500 },
        // Dodaj inne zakresy cen dla innych endpointów
    });

    const position = [50.045, 20.5];
    const maxBounds = [
        [49.95, 19.7],
        [50.2, 20.3],
    ];
    const minZoom = 12;
    const maxZoom = 18;

    const getColor = (price) => {
        const { min, max } = priceRanges[selectedEndpoint];

        const startColor = [15, 255, 75];
        const endColor = [255, 15, 75];

        const normalizedPrice = (price - min) / (max - min); // Normalizacja ceny do zakresu 0-1

        const interpolatedColor = startColor.map((startValue, index) => {
            const endValue = endColor[index];
            const interpolatedValue = startValue + (endValue - startValue) * normalizedPrice;
            return Math.floor(interpolatedValue);
        });

        return `rgb(${interpolatedColor.join(',')})`;
    };

    const onEachDistrict = async (district, layer) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/record/${selectedEndpoint}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();

            const districtId = district.properties.cartodb_id;
            const matchedDistrict = jsonData.find(item => item.id === districtId);

            if (matchedDistrict) {
                const districtName = district.properties.name;
                const districtPrice = matchedDistrict.average_price;

                const infoText = `
                    <div class="district-info">
                        <h3>${districtName}</h3>
                        <p>Average Price: ${districtPrice}</p>
                    </div>
                `;

                layer.bindTooltip(infoText, {
                    permanent: true,
                    direction: 'center',
                    opacity: 0.75
                });

                layer.setStyle({
                    fillColor: getColor(districtPrice),
                    fillOpacity: 0.7,
                    color: 'black',
                    weight: 2,
                });

                setEndpointData(matchedDistrict);
            }
        } catch (error) {
            console.error('Błąd pobierania danych:', error);
        }
    };

    useEffect(() => {
        // Pobieranie danych przy załadowaniu komponentu
        onEachDistrict();
    }, [selectedEndpoint]);

    useEffect(() => {
        // Po zmianie endpointu, odśwież mapę wywołując onEachDistrict ponownie dla wszystkich warstw
        Object.values(layers).forEach(layer => {
            onEachDistrict(layer.feature, layer);
        });
    }, [selectedEndpoint, layers]);

    const handleChange = (event) => {
        setSelectedEndpoint(event.target.value);
    };

    const addLayer = (layer) => {
        setLayers(prevLayers => ({
            ...prevLayers,
            [layer.feature.properties.cartodb_id]: layer,
        }));
    };

    const removeLayer = (layerId) => {
        setLayers(prevLayers => {
            const newLayers = { ...prevLayers };
            delete newLayers[layerId];
            return newLayers;
        });
    };

    return (
        <div>
            <div className="form-container">
                <form>
                    Kawalerki<br/>
                    <label>
                        <input
                            type="radio"
                            value="olx/1_0"
                            checked={selectedEndpoint === 'olx/1_0'}
                            onChange={handleChange}
                        />
                        Cały okres
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/1_30"
                            checked={selectedEndpoint === 'olx/1_30'}
                            onChange={handleChange}
                        />
                        Ostatnie 30 dni
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/1_60"
                            checked={selectedEndpoint === 'olx/1_60'}
                            onChange={handleChange}
                        />
                        Ostatnie 30-60 dni
                    </label>
                    <br/>Mieszkania dwupokojowe<br/>
                    <label>
                        <input
                            type="radio"
                            value="olx/2_0"
                            checked={selectedEndpoint === 'olx/2_0'}
                            onChange={handleChange}
                        />
                        Cały okres
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/2_30"
                            checked={selectedEndpoint === 'olx/2_30'}
                            onChange={handleChange}
                        />
                        Ostatnie 30 dni
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/2_60"
                            checked={selectedEndpoint === 'olx/2_60'}
                            onChange={handleChange}
                        />
                        Ostatnie 30-60 dni
                    </label>
                    <br/>Mieszkania trzypokojowe<br/>
                    <label>
                        <input
                            type="radio"
                            value="olx/3_0"
                            checked={selectedEndpoint === 'olx/3_0'}
                            onChange={handleChange}
                        />
                        Cały okres
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/3_30"
                            checked={selectedEndpoint === 'olx/3_30'}
                            onChange={handleChange}
                        />
                        Ostatnie 30 dni
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="olx/3_60"
                            checked={selectedEndpoint === 'olx/3_60'}
                            onChange={handleChange}
                        />
                        Ostatnie 30-60 dni
                    </label>
                    {/* Dodaj inne pola radio dla innych endpointów */}
                </form>
            </div>
            <MapContainer
                center={position}
                zoom={12.1}
                style={{ height: '100vh' }}
                maxBounds={maxBounds}
                minZoom={minZoom}
                maxZoom={maxZoom}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON
                    data={distData.features}
                    onEachFeature={(feature, layer) => {
                        onEachDistrict(feature, layer);
                        addLayer(layer);
                    }}
                />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
