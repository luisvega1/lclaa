import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newExposition,
  getExposition,
  updateExposition,
  getSpeakers,
  getEvents
} from "../../services/Services";

import { toast } from "react-toastify";
import { withNamespaces } from "react-i18next";
import Select from "react-select";
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

const ExpositionsForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  //FORM DEL EXPOSITION
  const [newExpositionForm, setNewExpositionForm] = useState({
    exposition: {
      event_id: "",
      name: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      speaker_ids: [],
      image: "",
      banner: "",
    },
    errors: {},
  });
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setNewExpositionForm({
      exposition: {
        ...newExpositionForm.exposition,
        [input.name]: value,
      },
      errors: {
        ...newExpositionForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newExpositionForm &&
      newExpositionForm.errors &&
      newExpositionForm.errors[inputName] &&
      newExpositionForm.errors[inputName][method]
    );
  };

  //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
  const getImage = (image, type) => {
    setNewExpositionForm({
      exposition: {
        ...newExpositionForm.exposition,
        [type]: image,
      },
    });
  };

  //ENVIAR REQUEST
  const submitNewExposition = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setNewExpositionForm({
      exposition: {
        ...newExpositionForm.exposition,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newExposition(newExpositionForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Exposition created.");
          setNewExpositionForm({
            speaker: {
              name: "",
              description: "",
              job: "",
              banner: "",
              avatar: "",
              events: [],
            },
            errors: {},
          });
          props.history.goBack();
        })
        .catch((error) => {
          Swal({
            title: "¡Alerta!",
            icon: "warning",
            text: error.response.data.message,
          });
        });
    } else {
      await updateExposition(
        { exposition: newExpositionForm.exposition },
        user.id
      )
        .then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Exposition modified.");
          setNewExpositionForm({
            exposition: {
              event_id: "",
              name: "",
              description: "",
              date: "",
              start_time: "",
              end_time: "",
              speakers_ids: [],
              image: "",
              banner: "",
            },
            errors: {},
          });
          props.history.goBack();
        })
        .catch((error) => {
          Swal({
            title: "Alert!",
            icon: "warning",
            text: error.response.data.message,
          });
        });
    }
  };

  const notify = (title) => {
    toast(title, {
      type: "success",
      position: "bottom-center",
    });
  };

  const formatDataForSelect = (object) => {
    object["value"] = object["id"];
    object["label"] = object["name"];
    delete object["id"];
    delete object["name"];
    return object;
  };

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getExpositionAPI() {
      await getExposition(props.match.params.id)
        .then((result) => {
          setUser(result.data);
          setNewExpositionForm({
            exposition: { ...result.data },
          });
        })
        .catch((error) => {
          Swal({
            title: "Alert!",
            icon: "warning",
            text: error.response.data.message,
          });
        });
    }

    async function getSpeakersAPI() {
      await getSpeakers().then((result) => {
        result.data.forEach((speaker) => {
          speaker = formatDataForSelect(speaker);
        });
        setSpeakers(result.data);
      });
    }

    async function getEventsAPI() {
      await getEvents().then((result) => {
        result.data.forEach((event) => {
          event = formatDataForSelect(event);
        });
        setEvents(result.data);
      });
    }

    if (!props.match.params.id) {
      const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
      setUser(user);
    } else {
      setEditMode(true);
      getExpositionAPI();
    }
    getSpeakersAPI();
    getEventsAPI();
  }, []);

  const handleOnChangeSelect = (value, { action, removedValue }) => {
    let newSpeakerIds = newExpositionForm.exposition.speaker_ids;
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        const elementIndex = newSpeakerIds.lastIndexOf(removedValue.value);
        newSpeakerIds.splice(elementIndex, 1);
        setNewExpositionForm({
          exposition: {
            ...newExpositionForm.exposition,
            speaker_ids: newSpeakerIds,
          },
        });
        break;
      case "clear":
        setNewExpositionForm({
          exposition: {
            ...newExpositionForm.exposition,
            speaker_ids: [],
          },
        });
        break;
      default:
        newSpeakerIds.push(value[value.length - 1].value);
        setNewExpositionForm({
          exposition: {
            ...newExpositionForm.exposition,
            speaker_ids: newSpeakerIds,
          },
        });
        break;
    }
  };

  const handleOnChangeEventsSelect = (value, { action, removedValue }) => {
    // let newSpeakerIds = newExpositionForm.exposition.speaker_ids;
    switch (action) {
      case "remove-value":
        console.log("CTM");
        //CUANDO BORRAS ELEMENTO
        // const elementIndex = newSpeakerIds.lastIndexOf(removedValue.value);
        // newSpeakerIds.splice(elementIndex, 1);
        // setNewExpositionForm({
        //   exposition: {
        //     ...newExpositionForm.exposition,
        //     speaker_ids: newSpeakerIds,
        //   },
        // });
        break;
      case "clear":
        console.log("HOLA MECO");
        // setNewExpositionForm({
        //   exposition: {
        //     ...newExpositionForm.exposition,
        //     speaker_ids: [],
        //   },
        // });
        break;
      default:
        console.log("HOLA");
        // newSpeakerIds.push(value[value.length - 1].value);
        // setNewExpositionForm({
        //   exposition: {
        //     ...newExpositionForm.exposition,
        //     speaker_ids: newSpeakerIds,
        //   },
        // });
        break;
    }
  };

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Exposition registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Exposition" : "Modify Exposition"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="exposition"
                onSubmit={submitNewExposition}
              >
                <Row>
                  <Col xl={6}>
                  <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Event
                      </label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeEventsSelect}
                          name="event_id"
                          options={events}
                        />
                        {hasErrors("exposition", "event_id", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Name</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="name"
                          invalid={hasErrors("exposition", "name", "required")}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.name}
                        />
                        {hasErrors("exposition", "name", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Description
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="textarea"
                          name="description"
                          invalid={hasErrors(
                            "exposition",
                            "description",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.description}
                        />
                        {hasErrors("exposition", "description", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Date</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="date"
                          name="date"
                          invalid={hasErrors(
                            "exposition",
                            "description",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.date}
                        />
                        {hasErrors("exposition", "date", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Start time
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="time"
                          name="start_time"
                          invalid={hasErrors(
                            "exposition",
                            "start_time",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.start_time}
                        />
                        {hasErrors("exposition", "start_time", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        End time
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="time"
                          isMulti
                          name="end_time"
                          invalid={hasErrors(
                            "exposition",
                            "end_time",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.end_time}
                        />
                        {hasErrors("exposition", "end_time", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Speakers
                      </label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeSelect}
                          name="speaker_ids"
                          isMulti
                          options={speakers}
                        />
                        {hasErrors("exposition", "speaker_ids", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="av"
                          type="avatar"
                          user={user}
                        />
                      </Col>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="ban"
                          type="banner"
                          user={user}
                        />
                      </Col>
                    </Row>
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

export default withNamespaces("translations")(ExpositionsForm);
