const axios = require('axios');

exports.getAddressCoordinates = async (address) => {
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    // console.log("Requesting URL:", url);

    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         const location = response.data.results[0].geometry.location;
    //         return {
    //             lat: location.lat,
    //             lng: location.lng
    //         };
    //     } else {
    //         console.error("Google Maps API response:", response.data);
    //         throw new Error(`Google Maps Error: ${response.data.status} - ${response.data.error_message || 'No details provided'}`);
    //     }
    // } catch (error) {
    //     throw new Error(`Error fetching coordinates: ${error.message}`);
    // }

    const apiKey = process.env.WEATHER_API; // Or use a separate OPENWEATHERMAP_API if preferred
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(address)}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);

        // OpenWeatherMap returns status in 'cod', not 'status'
        if (response.data.cod === 200 && response.data.coord) {
            return {
                lat: response.data.coord.lat,
                lng: response.data.coord.lon,
            };
        } else {
            throw new Error(`OpenWeatherMap Error: ${response.data.cod} - ${response.data.message || 'No details provided'}`);
        }
    } catch (error) {
        throw new Error(`Error fetching coordinates: ${error.message}`);
    }
};

exports.getDistanceAndTime = async (from, to) => {
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         const element = response.data.rows[0].elements[0];
    //         if (element.status === 'OK') {
    //             return {
    //                 distance: element.distance.text,
    //                 duration: element.duration.text
    //             };
    //         } else {
    //             throw new Error(`Distance Matrix Error: ${element.status}`);
    //         }
    //     } else {
    //         throw new Error(`Google Maps Error: ${response.data.status}`);
    //     }
    // } catch (error) {
    //     throw new Error(`Error fetching distance and time: ${error.message}`);
    // }

    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`;

    try {
        const { data } = await axios.get(url);

        if (data.routes && data.routes.length > 0) {
            const distanceMeters = data.routes[0].distance;
            const durationSeconds = data.routes[0].duration;

            // Convert to kilometers (1 km = 1000 m)
            const distanceKm = (distanceMeters / 1000).toFixed(2);

            // Convert seconds to hours and minutes
            const hours = Math.floor(durationSeconds / 3600);
            const minutes = Math.round((durationSeconds % 3600) / 60);
            const timeString = `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;

            return {
                distance: `${distanceKm} km`,
                duration: timeString,
            };
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        throw new Error(`OSRM Error: ${error.message}`);
    }
};

exports.getSuggestions = async (input) => {
    // const apiKey = process.env.GOOGLE_MAPS_API;
    // const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    // try {
    //     const response = await axios.get(url);
    //     if (response.data.status === 'OK') {
    //         return response.data.predictions.map(prediction => ({
    //             description: prediction.description,
    //             place_id: prediction.place_id
    //         }));
    //     } else {
    //         throw new Error(`Google Maps Error: ${response.data.status}`);
    //     }
    // } catch (error) {
    //     throw new Error(`Error fetching suggestions: ${error.message}`);
    // }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'MyApp/1.0' // Required by Nominatim usage policy
            }
        });

        return data.map(place => ({
            label: place.display_name,
            lat: place.lat,
            lon: place.lon
        }));
    } catch (error) {
        throw new Error(`Nominatim Error: ${error.message}`);
    }
};