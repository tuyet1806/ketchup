import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

// 링크 스타일 컴포넌트 정의
const StyledLink = styled(Link)`
  text-decoration: none; /* 링크에 대한 밑줄 제거 */
`;

const Container = styled.div`
  box-sizing: content-box;
  border-radius: 30px;
  place-items: center;
  border: 1px solid #dee2e6;

  & img {
    border-radius: 30px;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .name {
    font-weight: bold;
    margin-bottom: -1vw;
    text-align: center;
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .star {
      margin-top: 1.0em;
      margin-bottom: 0.8em;
      display: flex;
      align-items: center;
    }

    .dist,
    .phone,
    .review {
      text-align: center;
      font-size: 0.8em;
    }

    .dist {
      color: black;
    }

    .phone {
      color: #444;
    }

    .review {
    }
  }

  //컴포넌트간 간격
  & {
    border-top: 1px solid #dee2e6;
    margin: 2vh;
  }
`;

function RestaurantItem({ restaurant }) {
  // item에서 필요한 정보 추출
  const { place } = restaurant;
  const {
    id,
    name,
    rating,
    vicinity,
    geometry: { location },
    photos,
    formatted_phone_number
  } = place;

  const star = rating || "No rating";
  const review = null; // You can fetch reviews from Google Places API
  const img = photos && photos.length > 0 ? photos[0].getUrl() : null;
  const food = null; // You can fetch food type from Google Places API

  return (
    <StyledLink
      to={`/menulist/${id}?name=${name}&star=${star}&location=${vicinity}&img=${img}&food=${food}`}
    >
      <Container>
        <img src={img || "http://via.placeholder.com/160"} alt={name} />
        <p className="name">{name.length > 8 ? `${name.slice(0, 7)}...` : name}</p>
        <div className="box">
          <p className="star">
            <FaStar color="yellow" style={{ fontSize: "2em" }} />
            {star}
          </p>
          <div className="review">리뷰:{review}</div>
          <div className="dist">주소:{vicinity}</div>
          <div className="phone">번호:{formatted_phone_number}</div>
          <div></div>
        </div>
      </Container>
    </StyledLink>
  );
}

export default RestaurantItem;
