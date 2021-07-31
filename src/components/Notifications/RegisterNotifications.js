import React, { useState, useEffect } from "react";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import { newNotification, getNotification, updateNotification } from "../../services/Services";
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

const RegisterNotification = (props) => {

  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  //FORM DE NOTIFICATION
  const [newNotificationForm, setnewNotificationForm] = useState({
    notification: {
      title: "",
      body: "",
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setnewNotificationForm({
      notification: {
        ...newNotificationForm.notification,
        [input.name]: value,
      },
      errors: {
        ...newNotificationForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newNotificationForm &&
      newNotificationForm.errors &&
      newNotificationForm.errors[inputName] &&
      newNotificationForm.errors[inputName][method]
    );
  };

  //ENVIAR REQUEST
  const submitNewNotification = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setnewNotificationForm({
      notification: {
        ...newNotificationForm.notification,
      },
      errors,
    });

    //Validate if is valid make api request
    if(!editMode){
      await newNotification(newNotificationForm)
      .then(async (response) => {
        //USUARIO CREADO CORRECTAMENTE
        notify("Notification created.");
        setnewNotificationForm({
          notification: {
            title: "",
            body: "",
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
    }else{
      try {
        //USUARIO MODIFICADO CORRECTAMENTE
        await updateNotification({notification: newNotificationForm.notification}, notification.id);
        notify("Notification updated.");
        setnewNotificationForm({
          notification: {
            title: "",
            body: "",
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

  //SE EJECUTA AL INICIAR
  useEffect(() => {

    async function getNotificationAPI() {
      await getNotification(props.match.params.id).then( (result) => {
        console.log(result.data);
        setNotification(result.data);
        setnewNotificationForm({
          notification: {...result.data}
        });
      }).catch( (error) => {
        Swal({
          title: "Alert!",
          icon: "warning",
          text: error.data,
        });
      })
    }

    if(!props.match.params.id){
      const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
      setNotification(user);
    }else{
      setEditMode(true);
      getNotificationAPI();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>{!editMode ? "Notification registration" : "Update information"}</div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">{!editMode ? "New Notification" : "Modify Notification"}</CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="notification"
                onSubmit={submitNewNotification}
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
                          invalid={hasErrors("notification", "title", "required")}
                          data-validate='["required"]'
                          value={newNotificationForm.notification.title}
                        />
                        {hasErrors("notification", "title", "required") && (
                          <span className="invalid-feedback">
                           Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>      
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Body
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="textarea"
                          name="body"
                          invalid={hasErrors(
                            "notification",
                            "body",
                            "required"
                          )}
                          data-validate='["required"]'
                          value={newNotificationForm.notification.body}
                        />
                        {hasErrors("notification", "body", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
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

export default withNamespaces("translations")(RegisterNotification);
