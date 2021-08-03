import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import EasyPieChart from 'easy-pie-chart';

import CardTool from '../Common/CardTool'
import Sparkline from '../Common/Sparklines';
import Scrollable from '../Common/Scrollable'

import Now from '../Common/Now';

const Home = () => {
    return (
        <ContentWrapper>
            <div className="content-heading">
                <div>Dashboard</div>
            </div>
            <div className="text-right mb-3">
                
            </div>

            { /* START cards box */ }
                <Row>
                    <Col xl={ 3 } md={ 6 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                                <em className="icon-cloud-upload fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-primary rounded-right">
                                <div className="h2 mt-0">3</div>
                                <div className="text-uppercase">Documents</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } md={ 6 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-purple-dark justify-content-center rounded-left">
                                <em className="icon-globe fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-purple rounded-right">
                                <div className="h2 mt-0">20
                                    
                                </div>
                                <div className="text-uppercase">Expositions</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } lg={ 6 } md={ 12 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-green-dark justify-content-center rounded-left">
                                <em className="icon-bubbles fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-green rounded-right">
                                <div className="h2 mt-0">500</div>
                                <div className="text-uppercase">Clients</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } lg={ 6 } md={ 12 }>
                        { /* START date card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-green justify-content-center rounded-left">
                                <div className="text-center">
                                    <Now format="MMMM" className="text-sm" />
                                    <br />
                                    <Now format="D" className="h2 mt0" />
                                </div>
                            </div>
                            <div className="col-8 py-3 rounded-right">
                                <Now format="dddd" className="text-uppercase" />
                                <br />
                                <Now format="h:mm" className="h2 mt0 mr-sm" />
                                <Now format="a" className="text-muted text-sm" />
                            </div>
                        </div>
                        { /* END date card */ }
                    </Col>
                </Row>
                { /* END cards box */ }
                <Row>
                { /* START dashboard main content */ }
                    <Col xl={ 9 }>
                    
                    </Col>
                    <Col xl={3}>

                    </Col>
                </Row>

        </ContentWrapper>
    )
}

export default Home;