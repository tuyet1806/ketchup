import GetUserLocation from "../getUserLocation";
import { FaLocationArrow } from "react-icons/fa";
import styled from "styled-components";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
`;

const Wrapper = styled.div`
  height: 10vh;
  display: flex;
  align-items: center;
`;

const Header = () => {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <FaLocationArrow size={30} color="C35050" />
          <GetUserLocation />
        </Wrapper>
      </HeaderBlock>
    </>
  );
};

export default Header;
