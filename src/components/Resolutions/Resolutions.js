import React, { useState, useEffect } from "react";
import ReactDataGrid from "react-data-grid";
import { Button, Container } from "reactstrap";
import ContentWrapper from "../Layout/ContentWrapper";
import { getResolutions, deleteResolution } from "../../services/Services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";

const Resolutions = (props) => {
  const [data, setData] = useState([]);

  const notify = (title) => {
    toast(title, {
      type: "success",
      position: "bottom-center",
    });
  };

  const editButton = (props) => (
    <div className="text-center py-2">
      <Button color="warning" onClick={() => editResolution(props)}>
        {" "}
        <i className="far fa-edit"></i>{" "}
      </Button>
    </div>
  );

  const deleteButton = (props) => (
    <div className="text-center py-2">
      <Button color="danger" onClick={() => deleteResolutionFunction(props)}>
        {" "}
        <i class="far fa-trash-alt"></i>{" "}
      </Button>
    </div>
  );

  const editResolution = ({ value }) => {
    props.history.push(`/resolutions/${value}`);
  };

  const deleteResolutionFunction = async ({ value }) => {
    Swal({
      title: "Do you want to delete Resolution?",
      text: "Once deleted, the information cannot be recovered.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteResolution(value)
          .then(() => {
            let resolutions = [...data];
            setData(
              resolutions.filter((resolution) => resolution.id !== value)
            );
            notify("Resolution eliminated.");
          })
          .catch((error) => {
            Swal(error.data, {
              icon: "warning",
            });
          });
      }
    });
  };

  const activeFormatter = ({ value }) => (
    <div className="text-center">
      <em
        style={{ color: value ? "#27c24c" : "#f05050" }}
        className={value ? "fas fa-check" : "fas fa-times"}
      ></em>
    </div>
  );

  const eventFormatter = ({value}) => (
    <div className="text-center">
      <span>{value.name}</span>
    </div>
  );

  const rowGetter = (i) => data[i];

  const columns = [
    { key: "title", name: "Title" },
    { key: "body", name: "Body" },
    { key: "active", name: "Active", formatter: activeFormatter },
    { key: "event", name: "Event", formatter: eventFormatter },
    { key: "id", name: "Edit", formatter: editButton, width: 80 },
    { key: "id", name: "Delete", formatter: deleteButton, width: 80 },
  ];

  useEffect(() => {
    async function fetchResolutions() {
      await getResolutions().then((result) => {
        setData(result.data);
      });
    }

    fetchResolutions();
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>Resolutions</div>
      </div>
      <div className="text-right mb-3">
        <Button
          color="primary"
          className="shadow rounded-pill"
          onClick={() => props.history.push("/resolutions/new")}
        >
          {" "}
          <i class="fas fa-plus"></i> Create Resolution
        </Button>
      </div>
      <Container fluid className="shadow">
        <ReactDataGrid
          columns={columns}
          rowGetter={rowGetter}
          rowsCount={data.length}
          rowHeight={50}
          minHeight={700}
        />
      </Container>
    </ContentWrapper>
  );
};

export default Resolutions;
