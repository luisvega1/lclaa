import React, { useState, useEffect } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newResolution,
  getResolution,
  updateResolution,
  getEvents,
} from "../../services/Services";
import { toast } from "react-toastify";
import { withNamespaces } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  CardHeader,
} from "reactstrap";
import Swal from "sweetalert";
import Select from "react-select";

const ResolutionsForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [resolution, setResolution] = useState(null);
  const [events, setEvents] = useState([]);
  //FORM DE RESOLUTION
  const [newResolutionForm, setNewResolutionForm] = useState({
    resolution: {
      title: "",
      body: "",
      active: "",
      event_id: "",
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setNewResolutionForm({
      resolution: {
        ...newResolutionForm.resolution,
        [input.name]: value,
      },
      errors: {
        ...newResolutionForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newResolutionForm &&
      newResolutionForm.errors &&
      newResolutionForm.errors[inputName] &&
      newResolutionForm.errors[inputName][method]
    );
  };

  //ENVIAR REQUEST
  const submitnewResolution = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      i.name ? ["INPUT", "SELECT"].includes(i.nodeName) : null
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setNewResolutionForm({
      resolution: {
        ...newResolutionForm.resolution,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newResolution(newResolutionForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Resolution created.");
          setNewResolutionForm({
            resolution: {
              title: "",
              body: "",
              active: false,
              event_id: "",
            },
            errors: {},
          });
          props.history.goBack();
        })
        .catch((error) => {
          Swal({
            title: "¡Alerta!",
            icon: "warning",
            text: error.data,
          });
        });
    } else {
      try {
        //USUARIO MODIFICADO CORRECTAMENTE
        await updateResolution(
          { resolution: newResolutionForm.resolution },
          resolution.id
        );
        notify("Resolution updated.");
        setNewResolutionForm({
          resolution: {
            title: "",
            body: "",
            active: false,
            event_id: "",
          },
          errors: {},
        });
        props.history.goBack();
      } catch (error) {
        console.log(error);
        // Swal({
        //   title: "Alert!",
        //   icon: "warning",
        //   text: error.response.data.message,
        // });
      }
    }
  };

  const notify = (title) => {
    toast(title, {
      type: "success",
      position: "bottom-center",
    });
  };

  const formatDataForSelectEdit = (array) => {
    array.forEach((element) => {
      element.value = element.id;
      element.label = element.name;
    });
    return array;
  };

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getResolutionAPI() {
      await getResolution(props.match.params.id)
        .then((result) => {
          setResolution(result.data);
          setNewResolutionForm({
            resolution: { ...result.data },
          });
        })
        .catch((error) => {
          Swal({
            title: "Alert!",
            icon: "warning",
            text: error.data,
          });
        });
    }

    async function getEventsAPI() {
      await getEvents().then((result) => {
        setEvents(formatDataForSelectEdit(result.data));
      });
    }

    if (!props.match.params.id) {
      const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
      setResolution(user);
    } else {
      setEditMode(true);
      getResolutionAPI();
    }
    getEventsAPI();
  }, []);

  const handleOnChangeEventSelect = (value, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        if (!editMode) {
          setNewResolutionForm({
            resolution: {
              ...newResolutionForm.resolution,
              event_id: value.value,
            },
          });
        } else {
          setNewResolutionForm({
            resolution: {
              ...newResolutionForm.resolution,
              event_id: value.value,
            },
          });
        }
        break;
      case "clear":
        setNewResolutionForm({
          resolution: {
            ...newResolutionForm.resolution,
            event_id: "",
          },
        });
        break;
      default:
        if (!editMode) {
          setNewResolutionForm({
            resolution: {
              ...newResolutionForm.resolution,
              event_id: value.value,
            },
          });
        } else {
          setNewResolutionForm({
            resolution: {
              ...newResolutionForm.resolution,
              event_id: value.value,
            },
          });
        }
        break;
    }
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Resolution registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Resolution" : "Modify Resolution"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="resolution"
                onSubmit={submitnewResolution}
              >
                <Row>
                  <Col xl={6}>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Title</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="title"
                          invalid={hasErrors("resolution", "title", "required")}
                          data-validate='["required"]'
                          value={newResolutionForm.resolution.title}
                        />
                        {hasErrors("resolution", "title", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Body</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="textarea"
                          name="body"
                          invalid={hasErrors("resolution", "body", "required")}
                          data-validate='["required"]'
                          value={newResolutionForm.resolution.body}
                        />
                        {hasErrors("resolution", "body", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Active</label>
                      <div className="col-xl-8">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="active"
                            onChange={validateOnChange}
                            invalid={hasErrors(
                              "resolution",
                              "active",
                              "required"
                            )}
                            data-validate='["required"]'
                            checked={newResolutionForm.resolution.active}
                          />
                          <span></span>
                        </label>
                        {hasErrors("resolution", "active", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Event</label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeEventSelect}
                          name="event_id"
                          options={events}
                          invalid={hasErrors(
                            "resolution",
                            "event_id",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={events.find( (event) => event === !editMode ? newResolutionForm.resolution.event_id : resolution ? resolution.event ? resolution.event.id : "" : "")}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xl={12} className="d-flex flex-row justify-content-end">
                    <Button type="submit" color="primary" className="shadow">
                      {!editMode ? "Save" : "Update"}
                    </Button>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ContentWrapper>
  );
};

export default withNamespaces("translations")(ResolutionsForm);
