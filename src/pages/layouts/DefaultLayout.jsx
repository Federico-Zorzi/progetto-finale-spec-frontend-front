import { Outlet } from "react-router-dom";

import Header from "../../components/layout/Header";

const DefaultLayout = () => {
  return (
    <>
      <Header></Header>
      <Outlet></Outlet>
    </>
  );
};

export default DefaultLayout;
