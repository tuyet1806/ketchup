import styled from "styled-components";
import { LinearProgress } from "@mui/material";

const Title = styled.h1`
  color: #a82828;
  padding: 60vw 17vw;
  margin: 0 auto;
  font-size: 15vw;
  font-weight: bold;
`;

const Progress = styled.div`
  padding: 10vw;
  margin: 0 auto;
`;

const Splash = () => {
  return (
    <>
      <Title>KETCHUP</Title>
      <Progress>
        <LinearProgress style={{ height: 15 }} color="error" />
      </Progress>
    </>
  );
};

export default Splash;
