import React, { useState } from "react";
import { withNamespaces, Trans } from "react-i18next";
import ContentWrapper from "../Layout/ContentWrapper";
import {
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const SingleView = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // const changeLanguage = (lng) => {
  //   props.i18n.changeLanguage(lng);
  // };

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          Single View
          <small>
            <Trans i18nKey="dashboard.WELCOME"></Trans>
          </small>
        </div>
        {/* START Language list */}
        {/* <div className="ml-auto">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle>English</DropdownToggle>
            <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
              <DropdownItem onClick={() => changeLanguage("en")}>
                English
              </DropdownItem>
              <DropdownItem onClick={() => changeLanguage("es")}>
                Spanish
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
         */}
        {/* END Language list */}
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <h2 className="text-thin">Single view content</h2>
          <p>
            This project is an application skeleton. You can use it to quickly
            bootstrap your ReactJS webapp projects and dev environment for these
            projects.
            <br />
            The seed app doesn't do much and has most of the feature removed so
            you can add theme as per your needs just following the demo app
            examples.
          </p>
        </Col>
      </Row>
    </ContentWrapper>
  );
};

export default withNamespaces("translations")(SingleView);
