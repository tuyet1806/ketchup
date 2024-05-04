import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import RestaurantItem from "./RestaurantItem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const positionRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          positionRef.current = position;

          // Initialize Google Maps Places Service
          const service = new window.google.maps.places.PlacesService(document.createElement("div"));

          // Search for restaurants near the user's location
          service.nearbySearch(
            {
              location: new window.google.maps.LatLng(lat, lng),
              radius: 3000,
              type: "restaurant"
            },
            placesSearchCB
          );
        },
        () => {
          console.error('Failed to retrieve location information.');
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }

    function placesSearchCB(results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const sorted = getResInfo(results);
        setRestaurants(sorted);
      } else {
        console.error('Failed to search for restaurants.');
      }
    }

    function getResInfo(places) {
      var distancesWithPlaces = [];

      for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var placePosition = place.geometry.location;
        var distance = calculateDistance(placePosition, positionRef.current);

        distancesWithPlaces.push({
          index: i,
          distance: distance,
          place: place,
          placePosition: placePosition
        });
      }

      distancesWithPlaces.sort(function (a, b) {
        return a.distance - b.distance;
      });

      return distancesWithPlaces;
    }

    function calculateDistance(markerPosition, userPosition) {
      const lat1 = markerPosition.lat();
      const lng1 = markerPosition.lng();
      const lat2 = userPosition.coords.latitude;
      const lng2 = userPosition.coords.longitude;

      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lng1 - lng2;
      const radtheta = Math.PI * theta / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344; // Convert to kilometers
      return dist;
    }
  }, []);

  return (
    <div>
      <Wrapper>
        {restaurants.map((restaurant, index) => (
          <RestaurantItem
            key={index}
            restaurant={restaurant}
          />
        ))}
      </Wrapper>
    </div>
  );
}

export default RestaurantList;
