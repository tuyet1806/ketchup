import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

// Styled component for link
const StyledLink = styled(Link)`
  text-decoration: none; /* Remove underline for the link */
`;

// Styled component for the container
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

  // Component spacing
  & {
    border-top: 1px solid #dee2e6;
    margin: 2vh;
  }
`;

function RestaurantItem({ restaurant }) {
  // Extracting necessary information from the restaurant item
  const { place } = restaurant;
  const {
    id,
    name,
    rating,
    vicinity,
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
        console.log(name);
        <div className="box">
          <p className="star">
            <FaStar color="yellow" style={{ fontSize: "2em" }} />
            {star}
          </p>
          <div className="review">리뷰: {review}</div>
          <div className="dist">주소: {vicinity}</div>
          <div className="phone">번호: {formatted_phone_number}</div>
          <div></div>
        </div>
      </Container>
    </StyledLink>
  );
}

export default RestaurantItem;
