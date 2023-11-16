import React from 'react';

const PolygonData = ({ districts }) => {
    return (
        <div className="district-info">
            {districts.map((district, index) => (
                <div key={index} className="info-box">
                    <h3>Nazwa dzielnicy: {district.properties.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default PolygonData;
