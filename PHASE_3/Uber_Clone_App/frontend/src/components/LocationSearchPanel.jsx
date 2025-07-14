import React from 'react'

const LocationSearchPanel = (props) => {
    const locations = [
        "123 Main St, Downtown, Springfield",
        "456 Elm Ave, Near City Park, Metropolis",
        "789 Oak Rd, Tech Hub, Silicon Valley",
        "101 Maple Dr, Riverside, Lakeview"
    ];

    return (
        <div>
            {
                locations.map((location, index) => (
                    <div onClick={()=>{props.setVehiclePanel(true); props.setPanelOpen(false)}} key={index} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                        <h2 className='bg-[#eee] p-2 rounded-xl'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{location}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel