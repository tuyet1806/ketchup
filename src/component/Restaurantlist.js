import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import RestaurantItem from "./RestaurantItem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

function RestaurantList({ type }) {
  const [restaurants, setRestaurants] = useState([]);
  const positionRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          positionRef.current = position;

          const service = new window.google.maps.places.PlacesService(document.createElement('div'));
          service.nearbySearch({
            location: { lat, lng },
            radius: 3000,
            type: 'restaurant'
          }, callback);
        },
        () => {
          console.error('위치 정보를 가져오는데 실패했습니다.');
        }
      );
    } else {
      console.error('브라우저가 geolocation을 지원하지 않습니다.');
    }

    function callback(results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const sorted = getResInfo(results);
        setRestaurants(sorted);
      } else {
        console.error('검색에 실패했습니다.');
      }
    }

    function getResInfo(places) {
      var distancesWithPlaces = [];
      
      for (var i = 0; i < places.length; i++) {
        if (type === "전체" || places[i].types.includes(type)) {
          const distance = calculateDistance(places[i].geometry.location);
          distancesWithPlaces.push({
            index: i,
            distance: distance,
            place: places[i],
          });
        }
      }

      distancesWithPlaces.sort(function (a, b) {
        return a.distance - b.distance;
      });
      
      return distancesWithPlaces;
    }

    function calculateDistance(placeLocation) {
      const userLocation = positionRef.current.coords;
      const placeLatLng = new window.google.maps.LatLng(placeLocation.lat(), placeLocation.lng());
      const userLatLng = new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude);
      return window.google.maps.geometry.spherical.computeDistanceBetween(placeLatLng, userLatLng);
    }
  }, [type]);

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
