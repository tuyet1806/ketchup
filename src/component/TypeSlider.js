import Slider from "react-slick";
import "../style/slick.css";
import "../style/slick-theme.css";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import RestaruantList from "./Restaurantlist";

const Wrapper = styled.div`
  margin: 0 auto;
  padding-top: 15vh;
  padding-left: 10vw;
  padding-right: 10vw;
  font-size: 2vh;
`;

const Title = styled.div`
  color: #c35050;
  font-weight: bold;
`;

const Category = styled.h4`
  color: #000;

  &.active {
    color: #c35050;
    font-weight: bold;
  }
`;

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function TypeSlider() {
  const [category, setCategory] = useState("전체");
  const sliderRef = useRef(null);
  const [restaurantList, setRestaurantList] = useState([]);

  const settings = {
    className: "center",
    dots: false,
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 2,
    slidesToScroll: 2,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => {
      const categoryList = ["전체", "한식", "일식", "중식", "양식", "디저트"];
      setCategory(categoryList[current]);
    },
  };

  const onCategory = (category) => {
    setCategory(category);
    const index = ["전체", "한식", "일식", "중식", "양식", "디저트"].indexOf(category);
    sliderRef.current.slickGoTo(index);
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
            category + " restaurant"
          )}&key=AIzaSyDuISEVEDwkElLoYRbG2EYmbxvvrzJ-W3g`
        );
        const data = await response.json();
        setRestaurantList(data.results);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [category]);

  return (
    <Wrapper>
      <Title>카테고리</Title>
      <div className="slider-container">
        <Slider ref={sliderRef} {...settings}>
          <div onClick={() => onCategory("전체")}>
            <Category className={category === "전체" ? "active" : ""}>
              전체
            </Category>
          </div>
          <div onClick={() => onCategory("한식")}>
            <Category className={category === "한식" ? "active" : ""}>
              한식
            </Category>
          </div>
          <div onClick={() => onCategory("일식")}>
            <Category className={category === "일식" ? "active" : ""}>
              일식
            </Category>
          </div>
          <div onClick={() => onCategory("중식")}>
            <Category className={category === "중식" ? "active" : ""}>
              중식
            </Category>
          </div>
          <div onClick={() => onCategory("양식")}>
            <Category className={category === "양식" ? "active" : ""}>
              양식
            </Category>
          </div>
          <div onClick={() => onCategory("디저트")}>
            <Category className={category === "디저트" ? "active" : ""}>
              디저트
            </Category>
          </div>
        </Slider>
      </div>
      <div>
        {category && (
          <RestaruantList key={category} type={category} list={restaurantList} />
        )}
      </div>
    </Wrapper>
  );
}

export default TypeSlider;
