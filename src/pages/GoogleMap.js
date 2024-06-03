import styled from "styled-components";
import React, { useEffect, useRef, useState, useCallback } from "react";
import '../style/ggmapApi.css';

// Styled components
// 스타일된 컴포넌트들
const Wrapper = styled.div` // Wrapper div for the entire component.
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // Full height of the viewport.
`;

const Button = styled.button` // Styled button component.
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

const ScrollButton = styled.button` // Styled button for scrolling to top.
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

const MapContainer = styled.div.withConfig({ // Styled div for the map container.
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: height 0.5s ease;
`;

const InfoContainer = styled.div.withConfig({ // Styled div for the info container.
  shouldForwardProp: (prop) => prop !== 'isFullScreen',
})`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 97%;
  height: ${({ isFullScreen }) => (isFullScreen ? '100%' : '45%')}; // Dynamic height based on fullscreen mode.
  overflow-y: auto;
  padding: 10px;
  background: #fff;
  z-index: 1000;
  transition: height 0.5s ease;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; // Show/hide based on visibility.
`;

const ButtonContainer = styled.div` // Container for buttons within the info container.
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.li` // Styled list item.
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ListItemImage = styled.img` // Styled image within list items.
  width: 80px;
  height: 80px;
  border-radius: 5px;
`;

const ListItemInfo = styled.div` // Container for info within list items.
  flex: 1;
`;

const ListItemTitle = styled.h5` // Title of list item.
  margin: 0;
`;

const ListItemDistance = styled.p` // Distance info within list item.
  margin: 5px 0;
  color: #888;
`;

const PlacesList = styled.ul` // Styled list for places.
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; // Show/hide based on visibility.
  width: 100%;
  height: 45%; // 45% height of the container.
  padding: 0;
  list-style: none;
  overflow-y: auto;
  margin-top: 10px;
`;

const DetailText = styled.p` // Styled text for details.
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
`;

const PhotoContainer = styled.div` // Container for photos within details.
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-x: auto;
`;

const DetailImage = styled.img` // Styled image within details.
  width: 200px;
  height: auto;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: transform 0.3s ease;
  &:hover { // Scale effect on hover.
    transform: scale(1.05);
  }
`;

const SearchForm = styled.form` // Styled form for search.
  margin-bottom: 10px;
`;

// GoogleMap component
// GoogleMap 컴포넌트
export default function GoogleMap() {
  // State variables declaration
  // 상태 변수 선언
  const [markers, setMarkers] = useState([]); // Markers array state
  const [infowindow, setInfowindow] = useState(null); // Info window state
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null); // Selected place details state
  const [map, setMap] = useState(null); // Map state
  const [isExpanded, setIsExpanded] = useState(false); // Expanded state
  const [isFullScreen, setIsFullScreen] = useState(false); // Fullscreen state
  const [listVisible, setListVisible] = useState(false); // List visibility state
  const [highlightedMarker, setHighlightedMarker] = useState(null); // Highlighted marker state
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null); // Current location marker state
  const [searchKeyword, setSearchKeyword] = useState(''); // Search keyword state
  const [previousSearchResults, setPreviousSearchResults] = useState([]); // Previous search results state
  const [scrolling, setScrolling] = useState(false); // Scrolling state

  // Function to scroll to top
  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reference for places list
  // 장소 목록을 위한 참조
  const placesListRef = useRef(null);

  // Effect hook to handle geolocation and initialize map
  // 지리적 위치 및 지도 초기화 처리를 위한 효과 훅
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

  // Callback function to render place list items
// 장소 목록 항목을 렌더링하는 콜백 함수
const renderPlaceList = useCallback((place, distance, marker, index) => {
  const placesList = placesListRef.current;
  if (!placesList) return;

  const listItem = document.createElement('li');
  listItem.className = 'item';

  listItem.addEventListener('click', function () {
    fetchPlaceDetails(place.place_id, marker);
  });

  const markerImg = document.createElement('img');
  if (place.photos && place.photos.length > 0) {
    markerImg.src = place.photos[0].getUrl({ maxWidth: 150, maxHeight: 150 });
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

  listItem.setAttribute('data-marker-id', index);

  const handleClick = () => {
    fetchPlaceDetails(place.place_id, marker);
  };
}, [infowindow, map, highlightedMarker]);

// Function to fetch place details
// 장소 세부 정보를 가져오는 함수
const fetchPlaceDetails = (placeId, marker) => {
  const service = new window.google.maps.places.PlacesService(map);
  service.getDetails({ placeId }, (place, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      setSelectedPlaceDetails(place);
      setIsExpanded(true);
      setListVisible(false);

      if (infowindow) {
        infowindow.close();
      }
      const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
      setInfowindow(newInfowindow);
      newInfowindow.open(map, marker);

      if (highlightedMarker) {
        highlightedMarker.setIcon(null);
      }
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
      setHighlightedMarker(marker);
    }
  });
};

// RestaurantList component
// RestaurantList 컴포넌트
const RestaurantList = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  }
};

// Effect hook for search functionality and map initialization
// 검색 기능과 지도 초기화를 위한 효과 훅
useEffect(() => {
  if (!map) return;

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };
  window.addEventListener('scroll', handleScroll);

  const searchPlaces = (keyword, location) => {
    if (!keyword || !location) {
      return;
    }

    setListVisible(true);
    setIsExpanded(false); // Hide info container when searching

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

          if (distance <= 5000) {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name
            });

            marker.addListener('click', function () {
              fetchPlaceDetails(place.place_id, marker);
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
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [map, renderPlaceList]);

// Function to handle search button click
// 검색 버튼 클릭을 처리하는 함수
const handleButtonClick = (keyword) => {
  if (!currentLocationMarker) {
    console.error('Current location not available.');
    return;
  }

  const location = currentLocationMarker.getPosition();
  window.searchPlaces(keyword, location);

  markers.forEach((marker) => {
    marker.setMap(null);
  });

  setMarkers([]);
  setPreviousSearchResults([]);
};

// Function to handle search form submission
// 검색 양식 제출을 처리하는 함수
const handleSearch = (event) => {
  event.preventDefault();
  const keyword = searchKeyword;
  setIsExpanded(false); // Hide detail info when starting new search

  if (currentLocationMarker && map) {
    map.panTo(currentLocationMarker.getPosition());
    window.searchPlaces(keyword, currentLocationMarker.getPosition());
  }

  markers.forEach(marker => marker.setMap(null));
  setMarkers([]);
  setPreviousSearchResults([]);
};

// Function to close info container
// 정보 컨테이너를 닫는 함수
const handleCloseInfo = () => {
  setSelectedPlaceDetails(null);
  setIsExpanded(false);
  setListVisible(true);
  if (infowindow) {
    infowindow.close();
  }
  if (highlightedMarker) {
    highlightedMarker.setIcon(null);
  }

  previousSearchResults.forEach(marker => marker.setMap(map));
  setMarkers(previousSearchResults);
};

// Function to toggle fullscreen mode
// 전체 화면 모드를 전환하는 함수
const handleToggleFullScreen = () => {
  setIsFullScreen(!isFullScreen);
};

// Return statement rendering the component
// 컴포넌트를 렌더링하는 반환문
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
      {listVisible && <PlacesList ref={placesListRef} isVisible={listVisible}>
        {/* Place List items will be appended here */}
      </PlacesList>}
      {isExpanded && (
        <InfoContainer isVisible={isExpanded} isFullScreen={isFullScreen}>
          <ButtonContainer>
            <button onClick={handleCloseInfo}>Close</button>
            <button onClick={handleToggleFullScreen}>
              {isFullScreen ? 'Collapse' : 'Expand'}
            </button>
          </ButtonContainer>
          {selectedPlaceDetails ? (
            <div>
              <h2>{selectedPlaceDetails.name}</h2>
              <DetailText>Address: {selectedPlaceDetails.formatted_address}</DetailText>
              <DetailText>Phone number: {selectedPlaceDetails.formatted_phone_number || 'N/A'}</DetailText>
              <PhotoContainer>
                {selectedPlaceDetails.photos && selectedPlaceDetails.photos.length > 0 ?
                  selectedPlaceDetails.photos.map((photo, index) => (
                    <DetailImage key={index} src={photo.getUrl({ maxWidth: 150 })} alt={`Place photo ${index + 1}`} />
                  ))
                  : 'No photos available'
                }
              </PhotoContainer>
              <DetailText>Rating: {selectedPlaceDetails.rating || 'N/A'}</DetailText>
              <DetailText>Reviews: {selectedPlaceDetails.user_ratings_total || 'N/A'}</DetailText>
              <div className="reviews">
                <h3>Reviews:</h3>
                <ul>
                  {selectedPlaceDetails.reviews && selectedPlaceDetails.reviews.length > 0 ? (
                    selectedPlaceDetails.reviews.map((review, index) => (
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
      {scrolling && <ScrollButton onClick={scrollToTop}>Scroll to Top</ScrollButton>}
    </Wrapper>
  );
}

