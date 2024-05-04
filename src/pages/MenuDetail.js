import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Nutrition from "../component/Nutrition";
import Profile from "../component/Profile";

const Box = styled.div`
  display: flex;
  flex-direction: column; //수직정렬
  align-items: center;

  .Image {
    margin-top: 6vh;
    border-radius: 3vw;
    width: 80vw;
    height: 35vh;
  }

  .Name {
    margin-top: 3vh;
    text-align: center;
    font-weight: bold;
    font-size: 5vw;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 2vh;
  width: 100%;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 4vh;
`;

const Button = styled.button`
  margin: 0 3vw;
  padding: 1vh 2vw;
  font-size: 4vw;
  font-weight: bold;
  background-color: #ffffff;
  color: #c35050;
  border-color: #c35050;
  border-radius: 1vw;
  box-shadow: 0 0.2vw 0.5vw rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 0 1vw 1vw -5px;
  }
`;

const MenuDetail = () => {
  const { id, Food_id } = useParams();
  const [food, setFood] = useState(null);
  const [content, setContent] = useState(null);

  //전달받은 id를 사용에 식당을 불러오고
  // find 메서드를 사용하여 전달받은 Food_id와 일치하는 음식 데이터를 불러옴

  useEffect(() => {
    axios
      .get(`http://localhost:8080/Restaruant/${id}`)
      .then((res) => {
        const restaurant = res.data;
        const foundFood = restaurant.food.find(
          (food) => food.Food_id === parseInt(Food_id)
        );
        setFood(foundFood);
      })
      .catch((error) => {
        alert("데이터를 불러오는데 실패하였습니다.", error);
      });
  }, [id, Food_id]);

  const ButtonClick = (type) => {
    if (type === "profile") {
      setContent("profile");
    } else if (type === "nutrition") {
      setContent("nutrition");
    }
  };

  return (
    <div>
      {food ? (
        <Box>
          <img className="Image" src={food.FoodImage} alt={food.FoodName} />
          <p className="Name">{food.FoodName}</p>
          <ButtonBox>
            <Button onClick={() => ButtonClick("profile")}>Description</Button>
            <Button onClick={() => ButtonClick("nutrition")}>Nutrition</Button>
          </ButtonBox>
          {content === "profile" && <Profile food={food} />}
          {content === "nutrition" && <Nutrition food={food} />}
        </Box>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default MenuDetail;
