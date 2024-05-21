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

const SearchForm = styled.form`
  margin-bottom: 10px;
`;

const MapContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isExpanded',
  })`
    width: 100%;
    height: ${({ isExpanded }) => (isExpanded ? '50%' : '100%')};
    position: relative;
    overflow: hidden;
    transition: height 0.5s ease;
  `;

const InfoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})`
  width: 100%;
  height: 50%;
  overflow-y: auto;
  padding: 10px;
  background: #fff;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const PlacesList = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
})`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  width: 100%;
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

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;



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

  useState(null);
  
  // Thêm hàm handleCloseInfo vào đây
  const handleCloseInfo = () => {
      setIsExpanded(false);
      setListVisible(true);
      if (infowindow) {
          infowindow.close();
      }
      // Hiển thị lại tất cả các markers
      markers.forEach(marker => marker.setMap(map));
      if (highlightedMarker) {
          highlightedMarker.setIcon(null); // Đặt lại biểu tượng cho marker được nhấn
      }
  };

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

        const searchPlaces = (keyword) => {
            if (!keyword) {
              return;
            }
          
            setListVisible(true);
          
            const request = {
              query: keyword,
              location: currentLocation,
              radius: 3000,
              type: 'restaurant'
            };
          
            const placesService = new window.google.maps.places.PlacesService(mapInstance);
            placesService.textSearch(request, placesSearchCallback);
          };
          

          const placesSearchCallback = (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const newMarkers = [];
          
              results.forEach((place, index) => {
                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                  currentLocation,
                  place.geometry.location
                );
          
                if (distance <= 3000) {
                  // Tạo marker cho địa điểm và thêm vào bản đồ
                  const marker = new window.google.maps.Marker({
                    position: place.geometry.location,
                    map: mapInstance,
                    title: place.name
                  });
          
                  // Thêm sự kiện click cho marker
                  marker.addListener('click', function () {
                    if (infowindow) {
                      infowindow.close();
                    }
                    const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
                    setInfowindow(newInfowindow);
                    newInfowindow.open(map, this);
                    setSelectedPlace(place);
                    setIsExpanded(true);
                    setListVisible(false);
          
                    if (highlightedMarker) {
                      highlightedMarker.setIcon(null);
                    }
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                    setHighlightedMarker(marker);
                  });
          
                  newMarkers.push(marker);
                  console.log("Marker added:", marker);
          
                  // Render danh sách và thêm sự kiện click cho mỗi phần tử
                  renderPlaceList(place, distance, marker, index);
                }
              });
          
              setMarkers(newMarkers);
            } else {
              alert('No results found!');
            }
          };
          
          const renderPlaceList = (place, distance, marker, index) => {
            // Tạo các phần tử danh sách
            const placesList = document.getElementById('placesList');
            const listItem = document.createElement('li');
            listItem.className = 'item';
          
            // Thêm sự kiện click cho mỗi phần tử danh sách
            listItem.addEventListener('click', function () {
              if (infowindow) {
                infowindow.close();
              }
              const newInfowindow = new window.google.maps.InfoWindow({ content: place.name });
              setInfowindow(newInfowindow);
              newInfowindow.open(mapInstance, marker);
              setSelectedPlace(place);
              setIsExpanded(true);
              setListVisible(false);
              mapInstance.setCenter(marker.getPosition());
          
              if (highlightedMarker) {
                highlightedMarker.setIcon(null);
              }
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
              setHighlightedMarker(marker);
            });
          
            // Tạo và thêm thông tin cho phần tử danh sách
            const markerImg = document.createElement('img');
            if (place.photos && place.photos.length > 0) {
              markerImg.src = place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 });
            } else {
              markerImg.src = 'placeholder.jpg';
            }
            markerImg.alt = 'No image available';
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
          
            const distanceElement = document.createElement('p');
            distanceElement.textContent = `Distance: ${Math.round(distance / 1000)} km`;
            distanceElement.className = 'gray';
            info.appendChild(distanceElement);
          
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
          
            listItem.setAttribute('data-marker-id', index);
          };
          
      window.searchPlaces = searchPlaces;
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  
  if (selectedPlace) {
    console.log("Selected Place Photos:", selectedPlace.photos);
  }
  }, [selectedPlace, searchKeyword]);
  
  // const handleCloseInfo = () => {
  //   setIsExpanded(false);
  //   setListVisible(true);
  //   if (infowindow) {
  //     infowindow.close();
  //   }
  //   markers.forEach(marker => marker.setMap(map));
  //   if (highlightedMarker) {
  //     highlightedMarker.setIcon(null);
  //   }
  // };
  
  const handleSearch = (event) => {
    event.preventDefault();
    window.searchPlaces(searchKeyword);
  };
  
  const handleButtonClick = (keyword) => {
  setSearchKeyword(keyword);
  window.searchPlaces(keyword);

  setListVisible(true);

  if (currentLocationMarker) {
    map.panTo(currentLocationMarker.getPosition());
  }

  markers.forEach(marker => marker.setMap(null)); // Xóa các marker cũ
  setMarkers([]); // Đặt lại danh sách marker

  const placesList = document.getElementById('placesList');
  placesList.innerHTML = '';
  const loadingItem = document.createElement('li');
  loadingItem.textContent = 'Loading...';
  placesList.appendChild(loadingItem);

  window.searchPlaces(keyword);
};

  
  
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
    <PlacesList id="placesList" isVisible={listVisible}></PlacesList>
    <InfoContainer isVisible={isExpanded}>
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
          <button onClick={handleCloseInfo}>Close</button>
        </div>
      ) : null}
    </InfoContainer>
  </Wrapper>
  );
  }
  
