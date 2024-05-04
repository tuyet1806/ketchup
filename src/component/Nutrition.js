import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTr = styled.tr`
  display: flex;
`;

const StyledTh = styled.th`
  width: 35vw;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const StyledTd = styled.td`
  width: 35vw;
  border: 1px solid #ddd;
  padding: 8px;
`;

const Nutrition = ({ food }) => {
  return (
    <div>
      <StyledTable>
        <tbody>
          <StyledTr>
            <StyledTh>Ingredient</StyledTh>
            <StyledTd>{food.Foodingredient}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Calorie</StyledTh>
            <StyledTd>{food.Foodcalorie}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Protein</StyledTh>
            <StyledTd>{food.Foodprotein}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Fat</StyledTh>
            <StyledTd>{food.Foodfat}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Carbohydrate</StyledTh>
            <StyledTd>{food.Foodcarbohydrate}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Sugars</StyledTh>
            <StyledTd>{food.Foodsugars}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Calcium</StyledTh>
            <StyledTd>{food.Foodcalcium}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Iron</StyledTh>
            <StyledTd>{food.FoodIron}</StyledTd>
          </StyledTr>
          <StyledTr>
            <StyledTh>Potassium</StyledTh>
            <StyledTd>{food.Foodpotassium}</StyledTd>
          </StyledTr>
        </tbody>
      </StyledTable>
    </div>
  );
};

export default Nutrition;
