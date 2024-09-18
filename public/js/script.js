// // initialise the socket io , iseeh connection request backend peh jaati heh 

// const socket = io(); 
// // console.log("hey");

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition((position)=>{
//         const {latitude , longitude} = position.coords;
//         socket.emit("send-location" , {latitude , longitude});

//     } , (error)=>{
//         console.error(error);
//     },
// // watchpositiom , we can set so much of settings 
// {
// enableHighAccuracy : true,
// timeout:5000,
// maximumAge:0,
// }
// ) ;
// }


// // now we use a function which wil ask for location permission , and also set point

//  const map = L.map("map").setView([0,0] , 10);
// //[0,0] is the coordinates , 10 is actually telling about zooming

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution:"okndvdgejg"
// }).addTo(map);

// L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';



// const markers = {};
// socket.on("receive-location" ,(data)=> {
//     const {id , latitude , longitude} = data;
//     map.setView([latitude , longitude] );
//     // for placing the marker
//     if(markers[id]){
//         markers[id].setLatLng([latitude , longitude]);
//     }
//     else{
//         markers[id] = L.marker([latitude , longitude]).addTo(map);
//     }
// }  );

// socket.on("user-disconnected" , (id)=>{
// if (markers[id]){
//     map.removeLayer(markers[id]);
//     delete markers[id];
// }
// })

















//  //get fake location
// const socket = io();

// // Get current geolocation and emit it
// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;

//             // Send real location to the backend
//             socket.emit("send-location", { latitude, longitude });

//             // Create a fake nearby location for testing
//             const fakeLatitude = latitude + 0.01; // Slightly alter the latitude
//             const fakeLongitude = longitude + 0.01; // Slightly alter the longitude

//             // Send fake location to the backend
//             socket.emit("send-location", {
//                 latitude: fakeLatitude,
//                 longitude: fakeLongitude,
//                 isFake: true,
//             });
//         },
//         (error) => {
//             console.error(error);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         }
//     );
// }

// // Initialize map
// const map = L.map("map").setView([0, 0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "okndvdgejg",
// }).addTo(map);

// L.Icon.Default.imagePath =
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";

// const markers = {};
// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude, isFake } = data;

//     // Set map view based on real location
//     if (!isFake) {
//         map.setView([latitude, longitude]);
//     }

//     // Place marker for real or fake location
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude]);
//     } else {
//         markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// });

// socket.on("user-disconnected", (id) => {
//     if (markers[id]) {
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// });


// // Add this to calculate the distance between two points
// const realMarker = markers[realUserId];
// const fakeMarker = markers[fakeUserId];

// if (realMarker && fakeMarker) {
//     const distance = map.distance(realMarker.getLatLng(), fakeMarker.getLatLng());
//     console.log(`Distance from real to fake location: ${distance} meters`);
// }








//showing both

const socket = io();

// Define markers for real and fake locations
let realMarker = null;
let fakeMarker = null;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Send real location to the backend
            socket.emit("send-location", { latitude, longitude });

            // Create a fake nearby location for testing
            const fakeLatitude = latitude + 0.001; // Slightly alter the latitude
            const fakeLongitude = longitude + 0.001; // Slightly alter the longitude

            // Send fake location to the backend
            socket.emit("send-location", {
                latitude: fakeLatitude,
                longitude: fakeLongitude,
                isFake: true,
            });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize map
const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "okndvdgejg",
}).addTo(map);

L.Icon.Default.imagePath =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/";

const customFakeIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // External or local icon image
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point for the icon
    popupAnchor: [1, -34], // Anchor point for popups relative to the icon
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", // Optional shadow
    shadowSize: [41, 41], // Size of the shadow
});

socket.on("receive-location", (data) => {
    const { id, latitude, longitude, isFake } = data;

    if (!isFake) {
        // Real location marker handling
        if (realMarker) {
            realMarker.setLatLng([latitude, longitude]); // Update real marker position
        } else {
            realMarker = L.marker([latitude, longitude]).addTo(map); // Create real marker
        }
        map.setView([latitude, longitude], 15); // Adjust map view to real location
    } else {
        // Fake location marker handling
        if (fakeMarker) {
            fakeMarker.setLatLng([latitude, longitude]); // Update fake marker position
        } else {
            fakeMarker = L.marker([latitude, longitude], { icon: customFakeIcon }).addTo(map); // Create fake marker with custom icon
        }
    }
});

socket.on("user-disconnected", (id) => {
    if (realMarker && markers[id]) {
        map.removeLayer(realMarker);
        realMarker = null;
    }
    if (fakeMarker && markers[id]) {
        map.removeLayer(fakeMarker);
        fakeMarker = null;
    }
});
