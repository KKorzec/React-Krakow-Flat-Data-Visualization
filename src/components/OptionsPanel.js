import React, { useState } from 'react';

const OptionsPanel = ({ onOptionChange }) => {
    const [selectedOption, setSelectedOption] = useState('rooms1'); // Domyślna opcja

    const handleOptionChange = (event) => {
        const newOption = event.target.value;
        setSelectedOption(newOption);
        onOptionChange(newOption);
    };

    return (
        <div className="options-panel">
            <h3>Wybierz opcję:</h3>
            <select value={selectedOption} onChange={handleOptionChange}>
                <option value="rooms1">Pokoje: 1</option>
                <option value="rooms2">Pokoje: 2</option>
                {/* Dodaj inne opcje */}
            </select>
        </div>
    );
};

export default OptionsPanel;
