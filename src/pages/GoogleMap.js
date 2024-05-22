import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import '../style/ggmapApi.css';

// 스타일된 구성요소
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const MapContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})`
  width: 100%;
  height: ${({ isExpanded }) => (isExpanded ? '55%' : '100%')};
  position: relative;
  overflow: hidden;
  transition: height 0.5s ease;
`;

const InfoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})`
  position: relative;
  width: 100%;
  height: 45%;
  overflow-y: auto;
  padding: 10px;
  background: #fff;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlacesList = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  width: 100%;
  height: 45%;
  padding: 0;
  list-style: none;
  overflow-y: auto;
`;

const DetailText = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
`;

const PhotoContainer = styled.div`
  display: flex;
  overflow-x: auto;
`;

const DetailImage = styled.img`
  width: 200px;
  height: auto;
  margin-right: 10px;
`;

const SearchForm = styled.form`
  margin-bottom: 10px;
`;

// 구글맵 컴포넌트
export default function GoogleMap() {
  const [markers, setMarkers] = useState([]);
  const [infowindow, setInfowindow] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [previousSearchResults, setPreviousSearchResults] = useState([]);

  const placesListRef = useRef(null);

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

        const mapInstance = new window.google.maps.Map(container, options);
        setMap(mapInstance);

        const currentLocation = new window.google.maps.LatLng(lat, lng);
        const marker = new window.google.maps.Marker({
          position: currentLocation,
          map: mapInstance,
          title: "Current Location"
        });
        setCurrentLocationMarker(marker);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const searchPlaces = (keyword, location) => {
      if (!keyword || !location) {
        return;
      }

      setListVisible(true);
      setIsExpanded(false); // 검색할 때 정보 컨테이너를 숨김

      const request = {
        query: keyword,
        location: location,
        radius: 3000,
        type: 'restaurant'
      };

      const placesService = new window.google.maps.places.PlacesService(map);
      placesService.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const newMarkers = [];

          results.forEach((place, index) => {
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              location,
              place.geometry.location
            );

            if (distance <= 3000) {
              const marker = new window.google.maps.Marker({
                position: place,
                position: place.geometry.location,
                map: map,
                title: place.name
              });

              marker.addListener('click', function () {
                if (infowindow) {
                  infowindow.close();
                }
                const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
                setInfowindow(newInfowindow);
                newInfowindow.open(map, this);
                setSelectedPlace(place);
                setIsExpanded(true);
                setListVisible(false); // 정보를 보여줄 때 목록을 숨김

                if (highlightedMarker) {
                  highlightedMarker.setIcon(null);
                }
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                setHighlightedMarker(marker);
              });

              newMarkers.push(marker);
              renderPlaceList(place, distance, marker, index);
            }
          });

          setMarkers(newMarkers);
        } else {
          alert('No results found!');
        }
      });
    };

    window.searchPlaces = searchPlaces;
  }, [map, infowindow, highlightedMarker]);

  const handleSearch = (event) => {
    event.preventDefault();
    handleButtonClick(searchKeyword);
  };

  const handleButtonClick = (keyword) => {
    setSearchKeyword(keyword);
    setListVisible(true);
    setIsExpanded(false); // 새로운 검색을 시작할 때 상세 정보를 숨김

    if (currentLocationMarker && map) {
      map.panTo(currentLocationMarker.getPosition());
      window.searchPlaces(keyword, currentLocationMarker.getPosition());
    }

    // 새로운 검색을 시작할 때 이전 마커를 지움
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // 이전 검색 결과를 저장
    setPreviousSearchResults(markers);
  };

  const handleCloseInfo = () => {
    setSelectedPlace(null);
    setIsExpanded(false);
    setListVisible(true);
    if (infowindow) {
      infowindow.close();
    }
    if (highlightedMarker) {
      highlightedMarker.setIcon(null);
    }

    // 상세 정보를 닫을 때 이전 목록을 다시 표시
    setMarkers(previousSearchResults);
  };

  const renderPlaceList = (place, distance, marker, index) => {
    const placesList = placesListRef.current;
    if (!placesList) return;

    const listItem = document.createElement('li');
    listItem.className = 'item';

    listItem.addEventListener('click', function () {
      if (infowindow) {
        infowindow.close();
      }
      const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
      setInfowindow(newInfowindow);
      newInfowindow.open(map, marker);
      setSelectedPlace(place);
      setIsExpanded(true);
      setListVisible(false); // 정보를 표시할 때 목록을 숨김
      if (map) {
        map.setCenter(marker.getPosition());
      }

      if (highlightedMarker) {
        highlightedMarker.setIcon(null);
      }
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      setHighlightedMarker(marker);
    });
    
    const markerImg = document.createElement('img');
    if (place.photos && place.photos.length > 0) {
      markerImg.src = place.photos[0].getUrl({ maxWidth: 150, maxHeight:1500 });
    } else {
      markerImg.src = 'placeholder.jpg';
    }
    markerImg.size = [{ maxWidth: 40, maxHeight: 40 }];
    markerImg.alt = 'No image available';
    markerImg.className = 'marker-img';
    listItem.appendChild(markerImg);
    
    const info = document.createElement('div');
    info.className = 'info';
  
    const title = document.createElement('h5');
    title.textContent = place.name;
    info.appendChild(title);
  
    const distanceElement = document.createElement('p');
    distanceElement.textContent = `거리: ${Math.round(distance / 1000)} km`;
    distanceElement.className = 'gray';
    info.appendChild(distanceElement);
  
    listItem.appendChild(info);
    placesList.appendChild(listItem);
  
    listItem.setAttribute('data-marker-id', index)
  }    
   
  return (
    <Wrapper>
      <SearchForm onSubmit={handleSearch}>
        <input
          type="text"
          id="keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Enter keyword..."
          size="15"
        />
        <button id="searchButton" type="submit">Search</button>
      </SearchForm>
      <MapContainer isExpanded={isExpanded}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
        <ButtonContainer>
          <button onClick={() => handleButtonClick('asian')}>Asian Restaurant</button>
          <button onClick={() => handleButtonClick('western')}>Western Restaurant</button>
          <button onClick={() => handleButtonClick('caffe')}>Caffe</button>
        </ButtonContainer>
      </MapContainer>
      {listVisible && <PlacesList ref={placesListRef} isVisible={listVisible}></PlacesList>}
      {isExpanded && (
        <InfoContainer isVisible={isExpanded}>
          <ButtonContainer>
            <button onClick={handleCloseInfo}>Close</button>
          </ButtonContainer>
          {selectedPlace ? (
            <div>
              <h2>{selectedPlace.name}</h2>
              <DetailText>Address: {selectedPlace.formatted_address}</DetailText>
              <DetailText>Phone number: {selectedPlace.formatted_phone_number || 'N/A'}</DetailText>
              <PhotoContainer>
                {selectedPlace.photos && selectedPlace.photos.length > 0 ? 
                  selectedPlace.photos.map((photo, index) => (
                    <DetailImage key={index} src={photo.getUrl({ maxWidth: 200 })} alt={`Place photo ${index + 1}`} />
                  )) 
                  : 'No photos available'
                }
              </PhotoContainer>
              <DetailText>Rating: {selectedPlace.rating || 'N/A'}</DetailText>
              <DetailText>Reviews: {selectedPlace.user_ratings_total || 'N/A'}</DetailText>
              <div className="reviews">
                <h3>Reviews:</h3>
                <ul>
                  {selectedPlace.reviews && selectedPlace.reviews.length > 0 ? (
                    selectedPlace.reviews.map((review, index) => (
                      <li key={index}>
                        <p>Author: {review.author_name}</p>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.text}</p>
                      </li>
                    ))
                  ) : (
                    <li>No reviews</li>
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </InfoContainer>
      )}
    </Wrapper>
  );
}
