import React, { Component } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import { getResolution } from "../../services/Services";
import Datatable from "../Common/Datatable";
import FlotChart from "../Common/Flot";
import { Col, Card, CardHeader, CardBody, CardTitle, Row } from "reactstrap";
import $ from "jquery";

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
          data: response.data.yes,
          color: "#39C558",
        },
        {
          label: "Negative votes",
          data: response.data.no,
          color: "#ff3e43",
        },
        {
          label: "Null votes",
          data: response.data.null,
          color: "#FFBE41",
        },
      ];
      let options = {
        series: {
          pie: {
            show: true,
            innerRadius: 0.5, // This makes the donut shape
          },
        },
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
          <div>Votes list</div>
        </div>
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
                          <td>{vote.answer ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Datatable>
              </CardBody>
            </Card>
          </Col>
          <Col xl={4}>
            <FlotChart
              options={this.state.chartDonut.options}
              data={this.state.chartDonut.data}
              className="flot-chart"
              height="250px"
            />
          </Col>
        </Row>
      </ContentWrapper>
    ) : null;
  }
}

export default Votes;
