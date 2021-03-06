import React, { useState, useEffect } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newFile,
  getFile,
  updateFile,
  getEvents
} from "../../services/Services";
import { toast } from "react-toastify";
import Dropzone from 'react-dropzone';
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

const EventFilesForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [events, setEvents] = useState([]);
  //FORM DEL ADMINSITRADOR
  const [newFileForm, setNewFileForm] = useState({
    event_file: {
      name: "",
      description: "",
      file: "",
      file_content_file: "",
      filename: "",
      event_id: ""
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setNewFileForm({
      event_file: {
        ...newFileForm.event_file,
        [input.name]: value,
      },
      errors: {
        ...newFileForm.errors,
        [input.name]: result,
      },
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

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newFileForm &&
      newFileForm.errors &&
      newFileForm.errors[inputName] &&
      newFileForm.errors[inputName][method]
    );
  };

  //ENVIAR REQUEST
  const submitNewFile = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>{
      if(i.name){
        return ["INPUT", "SELECT"].includes(i.nodeName)
      }
    });
    const { errors } = FormValidator.bulkValidate(inputs);

    setNewFileForm({
      event_file: {
        ...newFileForm.event_file,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newFile(newFileForm)
        .then(async (response) => {
          //FILE CREADO CORRECTAMENTE
          notify("File uploaded.");
          setNewFileForm({
            event_file: {
              name: "",
              description: "",
              file: "",
              file_content_file: "",
              filename: "",
              event_id: ""
            },
            errors: {},
          });
          props.history.goBack();
        })
        .catch((error) => {
          Swal({
            title: "??Alerta!",
            icon: "warning",
            text: error.data,
          });
        });
    } else {
      await updateFile({ event_file: newFileForm.event_file }, file.id)
        .then(() => {
          //FILE MODIFICADO CORRECTAMENTE
          notify("File modified.");
          setNewFileForm({
            event_file: {
              name: "",
              description: "",
              file: "",
              file_content_file: "",
              filename: "",
              event_id: ""
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

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getFileAPI() {
      await getFile(props.match.params.id)
        .then((result) => {
          setFile(result.data);
          setNewFileForm({
            event_file: { ...result.data },
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

    async function getEventsAPI(){
      await getEvents().then((result) => {
        setEvents(formatDataForSelectEdit(result.data));
      }).catch( (error) => {
        console.log(error);
        Swal({
          title: "Alert!",
          icon: "warning",
          text: error.data,
        });
      })
    }

    if (props.match.params.id) {
      setEditMode(true);
      getFileAPI();
    }
    getEventsAPI();
  }, []);

  const getBase64 = async (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
  
    return new Promise((reslove, reject) => {
      reader.onload = () => reslove(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    })
  }

  const onDrop = async acceptedFiles => {
    const result = await getBase64(acceptedFiles[0]);
    setNewFileForm({
      event_file: {
        ...newFileForm.event_file,
        file: result,
        file_content_file: acceptedFiles[0]['type'],
        filename: acceptedFiles[0]['name']
      }
    });
  };

  const handleOnChangeEventSelect = (value, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
        //CUANDO BORRAS ELEMENTO
        if(!editMode){
          setNewFileForm({
            event_file: {
              ...newFileForm.event_file,
              event_id: value.value,
            },
          });
        }else{
          // let sponsorsArray = [...newEventForm.event.sponsors];
          // const elementIndex = newSponsorsId.lastIndexOf(removedValue.value);

          // sponsorsArray.splice(elementIndex, 1);
          // newSponsorsId.splice(elementIndex, 1);
          setNewFileForm({
            event_file: {
              ...newFileForm.event_file,
              event_id: value.value,
            },
          });
        }
        break;
      case "clear":
        setNewFileForm({
          event_file: {
            ...newFileForm.event_file,
            event_id: "",
          },
        });
        break;
      default:
        if(!editMode){
          setNewFileForm({
            event_file: {
              ...newFileForm.event_file,
              event_id: value.value,
            },
          });
        }else{
          setNewFileForm({
            event_file: {
              ...newFileForm.event_file,
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
          {!editMode ? "File Upload" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New File" : "Modify File"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="event_file"
                onSubmit={submitNewFile}
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
                          invalid={hasErrors("event_file", "name", "required")}
                          data-validate='["required"]'
                          value={newFileForm.event_file.name}
                        />
                        {hasErrors("event_file", "name", "required") && (
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
                          invalid={hasErrors("event_file", "description", "required")}
                          data-validate='["required"]'
                          value={newFileForm.event_file.description}
                        />
                        {hasErrors("event_file", "description", "required") && (
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
                            "event_file",
                            "event_id",
                            "required"
                          )}
                          data-validate='["event_id"]'
                          value={events.find( (event) => event === !editMode ? newFileForm.event_file.event_id : file ? file.event_id : "")}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Dropzone className="card p-3" onDrop={onDrop}>
                          <div className="text-center box-placeholder m-0">Drop some files here, or click to select files to upload.</div>
                          {
                            newFileForm.event_file.file && (
                              <h4 className="text-center mt-3">Selected File: { !editMode ? newFileForm.event_file.filename : newFileForm ? newFileForm.event_file.file_file_name : ""} </h4>
                            )
                          }
                      </Dropzone>
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

export default withNamespaces("translations")(EventFilesForm);
