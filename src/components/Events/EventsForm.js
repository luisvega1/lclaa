import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newEvent,
  getEvent,
  updateEvent,
  getSpeakers,
  getSponsors
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

const EventsForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [event, setEvent] = useState(null);
  //FORM DEL EXPOSITION
  const [newEventForm, setNewEventForm] = useState({
    event: {
      name: "",
      description: "",
      date: "",
      address: "",
      location_info: "",
      img_location: "",
      img_map: "",
      latitude: "",
      longitude: "",
      speaker_ids: [],
      sponsor_ids: [],
      image: "",
      banner: "",
    },
    errors: {},
  });
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setNewEventForm({
      event: {
        ...newEventForm.event,
        [input.name]: value,
      },
      errors: {
        ...newEventForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newEventForm &&
      newEventForm.errors &&
      newEventForm.errors[inputName] &&
      newEventForm.errors[inputName][method]
    );
  };

  //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
  const getImage = (image, type) => {
    setNewEventForm({
      event: {
        ...newEventForm.event,
        [type]: image,
      },
    });
  };

  //ENVIAR REQUEST
  const submitNewEvent = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>{
      if(i.name){
        return ["INPUT", "SELECT"].includes(i.nodeName)
      }
    });
    const { errors } = FormValidator.bulkValidate(inputs);

    setNewEventForm({
      event: {
        ...newEventForm.event,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newEvent(newEventForm)
        .then(async (response) => {
          //EVENTO CREADO CORRECTAMENTE
          notify("Event created.");
          setNewEventForm({
            event: {
              name: "",
              description: "",
              date: "",
              address: "",
              location_info: "",
              img_location: "",
              img_map: "",
              latitude: "",
              longitude: "",
              speaker_ids: [],
              sponsor_ids: [],
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
      await updateEvent(
        { event: newEventForm.event },
        event.id
      ).then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Event modified.");
          setNewEventForm({
            event: {
              name: "",
              description: "",
              date: "",
              address: "",
              location_info: "",
              img_location: "",
              img_map: "",
              latitude: "",
              longitude: "",
              speaker_ids: [],
              sponsor_ids: [],
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

  const formatDataForSelect = (object) => {
    object["value"] = object["id"];
    object["label"] = object["name"];
    delete object["id"];
    delete object["name"];
    return object;
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
    async function getEventAPI() {
      await getEvent(props.match.params.id)
        .then((result) => {
          setEvent(result.data);
          setNewEventForm({
            event: { ...result.data },
            sponsors: formatDataForSelectEdit(result.data.sponsors)
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

    async function getSpeakersAPI() {
      await getSpeakers().then((result) => {
        result.data.forEach((speaker) => {
          speaker = formatDataForSelect(speaker);
        });
        setSpeakers(result.data);
      });
    }

    async function getSponsorsAPI() {
      await getSponsors().then((result) => {
        result.data.forEach((sponsor) => {
          sponsor = formatDataForSelect(sponsor);
        });
        setSponsors(result.data);
      });
    }

    if (props.match.params.id) {
      setEditMode(true);
      getEventAPI();
    }
    getSpeakersAPI();
    getSponsorsAPI();
  }, []);

  const handleOnChangeSelect = (value, { action, removedValue }) => {
    console.log(newEventForm);
    let newSpeakerIds = newEventForm.event.speaker_ids;
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        const elementIndex = newSpeakerIds.lastIndexOf(removedValue.value);
        newSpeakerIds.splice(elementIndex, 1);
        setNewEventForm({
          event: {
            ...newEventForm.event,
            speaker_ids: newSpeakerIds,
          },
        });
        break;
      case "clear":
        setNewEventForm({
          event: {
            ...newEventForm.event,
            speaker_ids: [],
          },
        });
        break;
      default:
        newSpeakerIds.push(value[value.length - 1].value);
        setNewEventForm({
          event: {
            ...newEventForm.event,
            speaker_ids: newSpeakerIds,
          },
        });
        break;
    }
  };

  const handleOnChangeSponsorsSelect = (value, { action, removedValue }) => {
    let newSponsorsId = newEventForm.event.sponsor_ids;
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        if(!editMode){
          const elementIndex = newSponsorsId.lastIndexOf(removedValue.value);
          newSponsorsId.splice(elementIndex, 1);
          setNewEventForm({
            event: {
              ...newEventForm.event,
              sponsor_ids: newSponsorsId,
            },
          });
        }else{
          let sponsorsArray = [...newEventForm.event.sponsors];
          const elementIndex = newSponsorsId.lastIndexOf(removedValue.value);

          sponsorsArray.splice(elementIndex, 1);
          newSponsorsId.splice(elementIndex, 1);
          setNewEventForm({
            event: {
              ...newEventForm.event,
              sponsor_ids: newSponsorsId,
              sponsors: sponsorsArray
            },
          });
        }
        break;
      case "clear":
        setNewEventForm({
          event: {
            ...newEventForm.event,
            sponsor_ids: [],
          },
        });
        break;
      default:
        if(!editMode){
          newSponsorsId.push(value[value.length - 1].value);
          setNewEventForm({
            event: {
              ...newEventForm.event,
              sponsor_ids: newSponsorsId,
            },
          });
        }else{
          newSponsorsId.push(value[value.length - 1].value);
          let sponsorsArray = [...newEventForm.event.sponsors];
          sponsorsArray.push(value[value.length - 1]);
          setNewEventForm({
            event: {
              ...newEventForm.event,
              sponsor_ids: newSponsorsId,
              sponsors: sponsorsArray
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
          {!editMode ? "Event registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Event" : "Modify Event"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="event"
                onSubmit={submitNewEvent}
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
                          invalid={hasErrors("event", "name", "required")}
                          data-validate='["required"]'
                          value={newEventForm.event.name}
                        />
                        {hasErrors("event", "name", "required") && (
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
                            "event",
                            "description",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newEventForm.event.description}
                        />
                        {hasErrors("event", "description", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Address
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="textarea"
                          name="address"
                          invalid={hasErrors(
                            "event",
                            "address",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newEventForm.event.address}
                        />
                        {hasErrors("event", "address", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Location info
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="textarea"
                          name="location_info"
                          invalid={hasErrors(
                            "event",
                            "location_info",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newEventForm.event.location_info}
                        />
                        {hasErrors("event", "location_description", "required") && (
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
                          type="text"
                          name="date"
                          invalid={hasErrors(
                            "event",
                            "description",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newEventForm.event.date}
                        />
                        {hasErrors("event", "date", "required") && (
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
                          invalid={hasErrors(
                            "event",
                            "speaker_ids",
                            "required"
                          )}
                          data-validate='["required"]'
                        />
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Sponsors
                      </label>
                      <div className="col-xl-8">
                        <Select
                          onChange={handleOnChangeSponsorsSelect}
                          name="sponsor_ids"
                          isMulti
                          options={sponsors}
                          invalid={hasErrors(
                            "event",
                            "sponsor_ids",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newEventForm.event.sponsors}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="img"
                          type="image"
                          user={event}
                        />
                      </Col>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="ban"
                          type="banner"
                          user={event}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="location"
                          type="img_location"
                          user={event}
                        />
                      </Col>
                      <Col xl={6}>
                        <ImageCropper
                          imageGetter={getImage}
                          id="map"
                          type="img_map"
                          user={event}
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

export default withNamespaces("translations")(EventsForm);
