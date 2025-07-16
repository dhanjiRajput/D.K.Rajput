import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    console.log("suggestions...", suggestions);

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.label);
        } else if (activeField === 'destination') {
            setDestination(suggestion.label);
        }
    }

    return (
        <div>
            {
                suggestions.map((location, index) => (
                    <div onClick={() => handleSuggestionClick(location)} key={index} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] p-2 rounded-xl'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{location.label}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel