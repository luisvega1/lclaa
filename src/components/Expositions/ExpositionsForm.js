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
  const [exposition, setExposition] = useState(null);
  //FORM DEL EXPOSITION
  const [newExpositionForm, setNewExpositionForm] = useState({
    exposition: {
      event_id: "",
      name: "",
      description: "",
      price: "",
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
      i.name ? ["INPUT", "SELECT"].includes(i.nodeName) : null
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
            exposition: {
              event_id: "",
              name: "",
              description: "",
              price: "",
              date: "",
              start_time: "",
              end_time: "",
              speaker_ids: [],
              image: "",
              banner: "",
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
      await updateExposition(
        { exposition: newExpositionForm.exposition },
        exposition.id
      )
        .then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Exposition modified.");
          setNewExpositionForm({
            exposition: {
              event_id: "",
              name: "",
              description: "",
              price: "",
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
            text: error.data,
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

  const formatDataForSelectEdit = (array) => {
    array.forEach( (element) => {
      element.value = element.id;
      element.label = element.name;
    });
    return array;
  }

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getExpositionAPI() {
      await getExposition(props.match.params.id)
        .then((result) => {
          setExposition(result.data);
          setNewExpositionForm({
            exposition: { ...result.data, speakers: formatDataForSelectEdit(result.data.speakers) },
          });
        })
        .catch((error) => {
          console.log(error);
          Swal({
            title: "Alert!",
            icon: "warning",
            text: error.data,
          });
        });
    }

    async function getSpeakersAPI() {
      await getSpeakers().then((result) => {
        setSpeakers(formatDataForSelectEdit(result.data));
      });
    }

    async function getEventsAPI() {
      await getEvents().then((result) => {
        setEvents(formatDataForSelectEdit(result.data));
      });
    }

    if (props.match.params.id) {
      setEditMode(true);
      getExpositionAPI();
    }
    getSpeakersAPI();
    getEventsAPI();
  }, []);

  const handleOnChangeSpeakersSelect = (value, { action, removedValue }) => {
    let newSpeakersId = newExpositionForm.exposition.speaker_ids;
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        if(!editMode){
          const elementIndex = newSpeakersId.lastIndexOf(removedValue.value);
          newSpeakersId.splice(elementIndex, 1);
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              speaker_ids: newSpeakersId,
            },
          });
        }else{
          let speakersArray = [...newExpositionForm.exposition.speakers];
          const elementIndex = newSpeakersId.lastIndexOf(removedValue.value);

          speakersArray.splice(elementIndex, 1);
          newSpeakersId.splice(elementIndex, 1);
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              speaker_ids: newSpeakersId,
              speakers: speakersArray
            },
          });
        }
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
        if(!editMode){
          newSpeakersId.push(value[value.length - 1].value);
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              speaker_ids: newSpeakersId,
            },
          });
        }else{
          newSpeakersId.push(value[value.length - 1].value);
          let speakersArray = [...newExpositionForm.exposition.speakers];
          speakersArray.push(value[value.length - 1]);
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              speaker_ids: newSpeakersId,
              speakers: speakersArray
            },
          });
        }
        break;
    }
  };

  const handleOnChangeEventSelect = (value, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        if(!editMode){
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              event_id: value.value,
            },
          });
        }else{
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              event_id: value.value,
            },
          });
        }
        break;
      case "clear":
        setNewExpositionForm({
          exposition: {
            ...newExpositionForm.exposition,
            event_id: "",
          },
        });
        break;
      default:
        if(!editMode){
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
              event_id: value.value,
            },
          });
        }else{
          setNewExpositionForm({
            exposition: {
              ...newExpositionForm.exposition,
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
                      <label className="col-xl-4 col-form-label">
                        Price
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="number"
                          name="price"
                          invalid={hasErrors(
                            "exposition",
                            "price",
                            "number"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.price}
                        />
                        {hasErrors("exposition", "price", "number") && (
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
                            "date",
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
                        Event
                      </label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeEventSelect}
                          name="event_id"
                          options={events}
                          invalid={hasErrors(
                            "exposition",
                            "event_id",
                            "required"
                          )}
                          data-validate='["event_id"]'
                          value={events.find( (event) => event === !editMode ? newExpositionForm.exposition.event_id : exposition ? exposition.event_id : "")}
                        />
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Speakers
                      </label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeSpeakersSelect}
                          name="speaker_ids"
                          isMulti
                          options={speakers}
                          invalid={hasErrors(
                            "event",
                            "speaker_ids",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newExpositionForm.exposition.speakers}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="av"
                          type="image"
                          user={exposition}
                        />
                      </Col>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="ban"
                          type="banner"
                          user={exposition}
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
