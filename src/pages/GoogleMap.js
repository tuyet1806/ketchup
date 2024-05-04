import styled from "styled-components";
import React, { useEffect } from "react";
import '../style/ggmapApi.css'; 

// 스타일링된 Wrapper 컴포넌트
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

// GoogleMap 컴포넌트 정의
export default function GoogleMap() {
    useEffect(() => {
        // 마커를 담을 배열
        var markers = [];

        // 마커 클릭 시 장소 이름을 표시할 InfoWindow
        var infowindow = new window.google.maps.InfoWindow({ zIndex: 1 });
        const container = document.getElementById('map');

        // 사용자의 현재 위치 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // 지도 옵션 설정
                const options = {
                    center: { lat: lat, lng: lng }, // 사용자의 현재 위치를 중심으로 설정
                    zoom: 15 // 기본 줌 레벨
                };

                // 지도 생성 및 객체 리턴
                const map = new window.google.maps.Map(container, options);

                // 사용자의 현재 위치에 마커 추가
                var userMarker = new window.google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map
                });

                // 장소 검색을 위한 PlaceService 객체 생성
                const placesService = new window.google.maps.places.PlacesService(map);

                // 사용자 위치 근처의 식당 검색
                placesService.nearbySearch({
                    location: { lat: lat, lng: lng },
                    radius: 3000,
                    type: 'restaurant'
                }, placesSearchCallback);

                // 검색 버튼에 대한 클릭 이벤트 핸들러 추가
                const searchButton = document.getElementById('searchButton');
                if (searchButton) {
                    searchButton.addEventListener('click', searchPlaces);
                }

                // 키워드 검색을 요청하는 함수
                function searchPlaces() {
                    var keyword = document.getElementById('keyword').value;

                    if (!keyword.replace(/^\s+|\s+$/g, '')) {
                        alert('키워드를 입력해주세요!');
                        return false;
                    }

                    placesService.textSearch({
                        query: keyword
                    }, placesSearchCallback);
                }

                // 검색 결과를 처리하는 콜백 함수
                function placesSearchCallback(results, status) {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        // 이전 마커 제거
                        markers.forEach(marker => {
                            marker.setMap(null);
                        });
                        markers = [];

                        // 새로운 마커 표시
                        results.forEach(place => {
                            var marker = new window.google.maps.Marker({
                                position: place.geometry.location,
                                map: map,
                                title: place.name
                            });

                            // 마커 클릭 이벤트 리스너 추가
                            marker.addListener('click', function () {
                                infowindow.setContent(place.name);
                                infowindow.open(map, this);
                            });

                            // 마커 배열에 추가
                            markers.push(marker);
                        });
                    } else {
                        alert('검색 결과가 없습니다!');
                    }
                }
            });
        } else {
            console.log("이 브라우저에서는 지오로케이션을 지원하지 않습니다.");
        }

    }, []);

    function handleSubmit(event) {
        event.preventDefault(); // 기본 제출 동작 방지
    }

    return (
        <Wrapper>
            <div className="map_wrap">
                <div id="map" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
                <div id="menu_wrap" className="bg_white">
                    <div className="option">
                        <div>
                            <form onSubmit={handleSubmit}>
                                키워드: <input type="text" id="keyword" defaultValue="" size="15" />
                                <button id="searchButton" type="submit">검색</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
