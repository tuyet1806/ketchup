import styled from "styled-components";
import React, { useEffect, useState } from "react";
import '../style/ggmapApi.css'; 

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

export default function GoogleMap() {
    const [markers, setMarkers] = useState([]);
    const [infowindow, setInfowindow] = useState(null);

    useEffect(() => {
        const container = document.getElementById('map');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const options = {
                    center: { lat: lat, lng: lng },
                    zoom: 15
                };

                const map = new window.google.maps.Map(container, options);

                const userMarker = new window.google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: "Your current location"
                });

                const placesService = new window.google.maps.places.PlacesService(map);

                const searchButton = document.getElementById('searchButton');
                if (searchButton) {
                    searchButton.addEventListener('click', searchPlaces);
                }

                function searchPlaces() {
                    const keyword = document.getElementById('keyword').value.trim();
                    if (!keyword) {
                        alert('Please enter a keyword!');
                        return;
                    }

                    placesService.textSearch({
                        query: keyword,
                        location: { lat: lat, lng: lng },
                        radius: 3000,
                        type: 'restaurant'
                    }, placesSearchCallback);
                }

                function placesSearchCallback(results, status) {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach(place => {
                            const marker = new window.google.maps.Marker({
                                position: place.geometry.location,
                                map: map,
                                title: place.name
                            });

                            marker.addListener('click', function () {
                                if (infowindow) infowindow.close();
                                const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
                                setInfowindow(newInfowindow);
                                newInfowindow.open(map, this);
                            });

                            setMarkers(prevMarkers => [...prevMarkers, marker]);
                        });

                        renderPlaceList(results);
                    } else {
                        alert('No results found!');
                    }
                }

                function renderPlaceList(places) {
                    const placesList = document.getElementById('placesList');
                    placesList.innerHTML = '';
                    places.forEach((place, index) => {
                        const listItem = document.createElement('li');
                        listItem.className = 'item';
                
                        const markerImg = document.createElement('img');
                        if (place.photos && place.photos.length > 0) {
                            markerImg.src = place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 });
                        } else {
                            markerImg.src = 'placeholder.jpg'; 
                        }
                        markerImg.alt = 'No image';
                        markerImg.className = 'marker-img';
                        listItem.appendChild(markerImg);
                
                        const info = document.createElement('div');
                        info.className = 'info';
                
                        const title = document.createElement('h5');
                        title.textContent = place.name;
                        info.appendChild(title);
                
                        const address = document.createElement('p');
                        address.textContent = place.formatted_address;
                        address.className = 'gray';
                        info.appendChild(address);
                
                        if (place.geometry && place.geometry.location) {
                            const distance = document.createElement('p');
                            distance.textContent = `Distance: ${place.geometry.location.distance}`; // Lấy thông tin khoảng cách
                            distance.className = 'gray';
                            info.appendChild(distance);
                        }
                
                        if (place.rating) {
                            const rating = document.createElement('p');
                            rating.textContent = `Rating: ${place.rating}`;
                            rating.className = 'gray';
                            info.appendChild(rating);
                        }
                
                        if (place.user_ratings_total) {
                            const reviews = document.createElement('p');
                            reviews.textContent = `Reviews: ${place.user_ratings_total}`;
                            reviews.className = 'gray';
                            info.appendChild(reviews);
                        }
                
                        listItem.appendChild(info);
                        placesList.appendChild(listItem);
                
                        listItem.addEventListener('click', () => {
                            if (infowindow) infowindow.close();
                            const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
                            setInfowindow(newInfowindow);
                            newInfowindow.open(map);
                        });
                    });
                }
                
                
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }, [infowindow]);

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <Wrapper>
            <div className="map_wrap">
                <div id="map" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
                <div id="menu_wrap" className="bg_white">
                    <div className="option">
                        <div>
                            <form onSubmit={handleSubmit}>
                               
                            Keyword: <input type="text" id="keyword" defaultValue="" size="15" />
                                <button id="searchButton" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                    <ul id="placesList"></ul>
                </div>
            </div>
        </Wrapper>
    );
}
