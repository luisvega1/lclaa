import React, { Component } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import { getResolution } from "../../services/Services";
import Datatable from "../Common/Datatable";
import MorrisChart from "../Common/Morris";
import { Col, Card, CardHeader, CardBody, CardTitle, Row } from "reactstrap";
import $, { data } from "jquery";

class Votes extends Component {
  state = {
    isLoading: true,
    dtOptions2: {
      paging: false, // Table pagination
      ordering: true, // Column ordering
      info: true, // Bottom left status text
      responsive: true,
      // Text translation options
      // Note the required keywords between underscores (e.g _MENU_)
      oLanguage: {
        zeroRecords: "Nothing found - sorry",
        infoEmpty: "No records available",
      },
      // Datatable Buttons setup
      dom: "Bfrtip",
      buttons: [
        { extend: "csv", className: "btn-info" },
        { extend: "excel", className: "btn-info", title: "XLS-File" },
      ],
    },
    resolution: {},
  };

  async componentDidMount() {
    try {
      const response = await getResolution(this.props.match.params.id);
      let data = [
        {
          label: "Positive votes",
          value: response.data.yes
        },
        {
          label: "Negative votes",
          value: response.data.no
        },
        {
          label: "Abstain votes",
          value: response.data.null
        },
      ];
      let options = {
        element: 'morris-donut',
        colors: ['#f05050', '#fad732', '#ff902b'],
        resize: true
      };
      this.setState({
        resolution: response.data,
        isLoading: false,
        chartDonut: { data: data, options: options },
      });
    } catch (error) {
      console.error(error.data);
    }
  }

  // Access to internal datatable instance for customizations
  dtInstance = (dtInstance) => {
    const inputSearchClass = "datatable_input_col_search";
    const columnInputs = $("tfoot ." + inputSearchClass);
    // On input keyup trigger filtering
    columnInputs.keyup(function () {
      dtInstance.fnFilter(this.value, columnInputs.index(this));
    });
  };

  render() {
    return !this.state.isLoading ? (
      <ContentWrapper>
        <div className="content-heading">
                <tag>{resolution.name}</tag>
            </div>
            <div className="text-right mb-3">
                
            </div>

            { /* START cards box */ }
                <Row>
                    <Col xl={ 3 } md={ 6 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-primary-dark justify-content-center rounded-left">
                                <em className="icon-bubbles fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-primary rounded-right">
                                <div className="h2 mt-0">{data.yes}</div>
                                <div className="text-uppercase">YES VOTES</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } md={ 6 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-danger-dark justify-content-center rounded-left">
                                <em className="icon-bubbles fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-danger rounded-right">
                                <div className="h2 mt-0">{data.no}
                                    
                                </div>
                                <div className="text-uppercase">NO VOTES</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } lg={ 6 } md={ 12 }>
                        { /* START card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-warning-dark justify-content-center rounded-left">
                                <em className="icon-bubbles fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-warning rounded-right">
                                <div className="h2 mt-0">{data.null}</div>
                                <div className="text-uppercase">ABSTAIN VOTES</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={ 3 } lg={ 6 } md={ 12 }>
                        { /* START date card */ }
                        <div className="card flex-row align-items-center align-items-stretch border-0">
                            <div className="col-4 d-flex align-items-center bg-green-dark justify-content-center rounded-left">
                                <em className="icon-bubbles fa-3x"></em>
                            </div>
                            <div className="col-8 py-3 bg-green rounded-right">
                                <div className="h2 mt-0">{data.votes_count}</div>
                                <div className="text-uppercase">TOTAL VOTES</div>
                            </div>
                        </div>
                        { /* END date card */ }
                    </Col>
                </Row>
                { /* END cards box */ }
        
        <Row>
          <Col xl={8}>
            <Card>
              <CardHeader>
                <CardTitle>Votes</CardTitle>
              </CardHeader>
              <CardBody>
                <Datatable options={this.state.dtOptions2}>
                  <table className="table table-striped my-4 w-100">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.resolution.votes.map((vote, index) => (
                        <tr key={index} className="gradeX">
                          <td>{vote.user.name}</td>
                          <td>{vote.user.lastname}</td>
                          <td>{vote.user.email}</td>
                          <td>{vote.answer === true ? 'Yes' : vote.answer === false ? 'No' : vote.answer === null ? 'Abstain' : 'Null' }</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Datatable>
              </CardBody>
            </Card>
          </Col>
          <Col xl={4}>
          <MorrisChart type={'Donut'} id="morris-donut" data={this.state.chartDonut.data} options={this.state.chartDonut.options}/>
          </Col>
        </Row>
      </ContentWrapper>
    ) : null;
  }
}

export default Votes;
