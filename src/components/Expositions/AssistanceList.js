import React, { Component } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import { getAssistanceList } from "../../services/Services";
import Datatable from "../Common/Datatable";
import { Col, Card, CardBody, Row } from "reactstrap";
import $ from "jquery";

class AssistanceList extends Component {
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
    assistanceList: [],
  };

  async componentDidMount() {
    try {
      const response = await getAssistanceList(this.props.match.params.id);
      this.setState({
        resolution: response.data,
        isLoading: false,
        assistanceList: response.data,
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
          <div>Assistance List</div>
        </div>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <Datatable options={this.state.dtOptions2}>
                  <table className="table table-striped my-4 w-100">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Paid</th>
                        <th>Charge Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.assistanceList.map((assistance, index) => (
                        <tr key={index} className="gradeX">
                          <td>{assistance.inscription.user.name}</td>
                          <td>{assistance.inscription.user.lastname}</td>
                          <td>{assistance.inscription.user.email}</td>
                          <td>
                            <em
                              style={{ color: assistance.inscription.paid ? "#27c24c" : "#f05050" }}
                              className={
                                assistance.inscription.paid ? "fas fa-check" : "fas fa-times"
                              }
                            ></em>
                          </td>
                          <td>{assistance.inscription.charge_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Datatable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    ) : null;
  }
}

export default AssistanceList;
