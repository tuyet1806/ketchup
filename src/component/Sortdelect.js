import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import styled from "styled-components";

const Wrapper = styled.div`
  padding-left: 45vw;
  padding-right: 5vw;
  padding-top: 3vw;
`;

function Sortselect({ onSortChange }) {
  const [sort, setSort] = useState(""); //정렬 상태

  //정렬 상태 변경
  const handleChange = (event) => {
    const selectedSort = event.target.value;
    setSort(selectedSort);
    onSortChange(selectedSort); //RestaruantList 컴포넌트로 선택된 정렬 기준 전달
  };

  return (
    <Wrapper>
      <Box sx={{ fontWeight: "fontWeightLight" }}>
        <FormControl fullWidth>
          <InputLabel
            id="demo-simple-select-label"
            sx={{ fontWeight: "bold", fontSize: 18 }}
          >
            정렬
          </InputLabel>
          <Select
            labelId="demo-simple-select-labe"
            id="demo-simple-select"
            value={sort}
            label="Sort"
            onChange={handleChange}
          >
            <MenuItem value={"distance"}>거리순</MenuItem>
            <MenuItem value={"review"}>리뷰순</MenuItem>
            <MenuItem value={"star"}>별점순</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Wrapper>
  );
}

export default Sortselect;
