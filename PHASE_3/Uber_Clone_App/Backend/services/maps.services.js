const axios = require('axios');

exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    console.log("Requesting URL:", url);

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            console.error("Google Maps API response:", response.data);
            throw new Error(`Google Maps Error: ${response.data.status} - ${response.data.error_message || 'No details provided'}`);
        }
    } catch (error) {
        throw new Error(`Error fetching coordinates: ${error.message}`);
    }
}
