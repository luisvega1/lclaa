import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newAdministrator,
  getAdministrator,
  updateAdministrator,
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

const RegisterAdministrator = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  //FORM DEL ADMINSITRADOR
  const [newAdministratorForm, setnewAdministratorForm] = useState({
    admin: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_num: "",
      city: "",
      state: "",
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setnewAdministratorForm({
      admin: {
        ...newAdministratorForm.admin,
        [input.name]: value,
      },
      errors: {
        ...newAdministratorForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newAdministratorForm &&
      newAdministratorForm.errors &&
      newAdministratorForm.errors[inputName] &&
      newAdministratorForm.errors[inputName][method]
    );
  };

  //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
  const getImage = (image, type) => {
    setnewAdministratorForm({
      admin: {
        ...newAdministratorForm.admin,
        [type]: image,
      },
    });
  };

  //ENVIAR REQUEST
  const submitnewAdministrator = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setnewAdministratorForm({
      admin: {
        ...newAdministratorForm.admin,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newAdministrator(newAdministratorForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Adminstrator created.");
          setnewAdministratorForm({
            admin: {
              name: "",
              lastname: "",
              email: "",
              password: "",
              password_confirmation: "",
              phone_num: "",
              city: "",
              state: "",
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
      await updateAdministrator({ admin: newAdministratorForm.admin }, user.id)
        .then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Administrator modified.");
          setnewAdministratorForm({
            admin: {
              name: "",
              lastname: "",
              email: "",
              password: "",
              password_confirmation: "",
              phone_num: "",
              city: "",
              state: "",
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

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getAdministratorAPI() {
      await getAdministrator(props.match.params.id)
        .then((result) => {
          console.log(result.data);
          setUser(result.data);
          setnewAdministratorForm({
            admin: { ...result.data },
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

    if (!props.match.params.id) {
      const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
      setUser(user);
    } else {
      setEditMode(true);
      getAdministratorAPI();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Administrator registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Administrator" : "Modify Administrator"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="admin"
                onSubmit={submitnewAdministrator}
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
                          invalid={hasErrors("admin", "name", "required")}
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.name}
                        />
                        {hasErrors("admin", "name", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Lastname
                      </label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="lastname"
                          invalid={hasErrors("admin", "lastname", "required")}
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.lastname}
                        />
                        {hasErrors("admin", "lastname", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Email</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="email"
                          invalid={
                            hasErrors("admin", "email", "required") ||
                            hasErrors("admin", "email", "email")
                          }
                          data-validate='["required","email"]'
                          value={newAdministratorForm.admin.email}
                        />
                        {hasErrors("admin", "email", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("admin", "email", "email") && (
                          <span className="invalid-feedback">
                            Field must be valid email
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Phone number</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="number"
                          name="phone_num"
                          invalid={
                            hasErrors("admin", "phone_num", "required") ||
                            hasErrors("admin", "phone_num", "number")
                          }
                          data-validate='["required","email"]'
                          value={newAdministratorForm.admin.phone_num}
                        />
                        {hasErrors("admin", "phone_num", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("admin", "phone_num", "number") && (
                          <span className="invalid-feedback">
                            Field must be valid phone number
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">State</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="state"
                          invalid={hasErrors("admin", "state", "required")}
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.state}
                        />
                        {hasErrors("admin", "lastname", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">City</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="city"
                          invalid={
                            hasErrors("admin", "city", "required")
                          }
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.city}
                        />
                        {hasErrors("admin", "city", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Password</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="password"
                          name="password"
                          invalid={
                            hasErrors("admin", "password", "required")
                          }
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.password}
                        />
                        {hasErrors("admin", "password", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Password confirmation</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="password"
                          name="password_confirmation"
                          invalid={
                            hasErrors("admin", "password_confirmation", "required")
                          }
                          data-validate='["required"]'
                          value={newAdministratorForm.admin.password_confirmation}
                        />
                        {hasErrors("admin", "password_confirmation", "required") && (
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

export default withNamespaces("translations")(RegisterAdministrator);
