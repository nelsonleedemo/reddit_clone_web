import React from "react";
import NavBar from "./NavBar";
import Wrapper, { WrapperVarient } from "./Wrapper";

interface LayoutProps {
  varient?: WrapperVarient;
}

const Layout: React.FC<LayoutProps> = ({ children, varient }) => {
  return (
    <>
      <NavBar />

      <Wrapper varient={varient}>{children}</Wrapper>
    </>
  );
};

export default Layout;
