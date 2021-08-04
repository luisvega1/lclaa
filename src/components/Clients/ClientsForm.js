import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newClient,
  getClient,
  updateClient,
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

const ClientForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [client, setClient] = useState(null);
  //FORM DEL ADMINSITRADOR
  const [newClientForm, setnewClientForm] = useState({
    client: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_num: "",
      city: "",
      state: "",
      registration_type: "",
      lclaa_chapter: "",
      zip: ""
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setnewClientForm({
      client: {
        ...newClientForm.client,
        [input.name]: value,
      },
      errors: {
        ...newClientForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newClientForm &&
      newClientForm.errors &&
      newClientForm.errors[inputName] &&
      newClientForm.errors[inputName][method]
    );
  };

  //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
  const getImage = (image, type) => {
    setnewClientForm({
      client: {
        ...newClientForm.client,
        [type]: image,
      },
    });
  };

  //ENVIAR REQUEST
  const submitnewClient = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setnewClientForm({
      client: {
        ...newClientForm.client,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newClient(newClientForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Client created.");
          setnewClientForm({
            client: {
              name: "",
              lastname: "",
              email: "",
              password: "",
              password_confirmation: "",
              phone_num: "",
              city: "",
              state: "",
              registration_type: "",
              lclaa_chapter: "",
              zip: ""
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
      await updateClient({ client: newClientForm.client }, client.id)
        .then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Client modified.");
          setnewClientForm({
            client: {
              name: "",
              lastname: "",
              email: "",
              password: "",
              password_confirmation: "",
              phone_num: "",
              city: "",
              state: "",
              registration_type: "",
              lclaa_chapter: "",
              zip: ""
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
    async function getClientAPI() {
      await getClient(props.match.params.id)
        .then((result) => {
          console.log(result.data);
          setClient(result.data);
          setnewClientForm({
            client: { ...result.data },
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

    if (!props.match.params.id) {
      const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
      setClient(user);
    } else {
      setEditMode(true);
      getClientAPI();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Client registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Client" : "Modify Client"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="client"
                onSubmit={submitnewClient}
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
                          invalid={hasErrors("client", "name", "required")}
                          data-validate='["required"]'
                          value={newClientForm.client.name}
                        />
                        {hasErrors("client", "name", "required") && (
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
                          invalid={hasErrors("client", "lastname", "required")}
                          data-validate='["required"]'
                          value={newClientForm.client.lastname}
                        />
                        {hasErrors("client", "lastname", "required") && (
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
                            hasErrors("client", "email", "required") ||
                            hasErrors("client", "email", "email")
                          }
                          data-validate='["required","email"]'
                          value={newClientForm.client.email}
                        />
                        {hasErrors("client", "email", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("client", "email", "email") && (
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
                            hasErrors("client", "phone_num", "required") ||
                            hasErrors("client", "phone_num", "number")
                          }
                          data-validate='["required","email"]'
                          value={newClientForm.client.phone_num}
                        />
                        {hasErrors("client", "phone_num", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("client", "phone_num", "number") && (
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
                          invalid={hasErrors("client", "state", "required")}
                          data-validate='["required"]'
                          value={newClientForm.client.state}
                        />
                        {hasErrors("client", "lastname", "required") && (
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
                            hasErrors("client", "city", "required")
                          }
                          data-validate='["required"]'
                          value={newClientForm.client.city}
                        />
                        {hasErrors("client", "city", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Zip Code</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="zip"
                          invalid={
                            hasErrors("client", "zip", "required")
                          }
                          data-validate='["required"]'
                          value={newClientForm.client.zip}
                        />
                        {hasErrors("client", "zip", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Registration type</label>
                      <div className="col-xl-8">
                        <select name="rol" class="custom-select custom-select-sm" onChange={validateOnChange} value={newClientForm.client.registration_type}>
                          <option value="1">Delegate</option>
                          <option value="3">Observer</option>
                        </select>
                      </div>
                    </FormGroup>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">LCLAA Chapter</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="lclaa_chapter"
                          invalid={
                            hasErrors("client", "lclaa_chapter", "required")
                          }
                          data-validate='["required"]'
                          value={newClientForm.client.lclaa_chapter}
                        />
                        {hasErrors("client", "lclaa_chapter", "required") && (
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
                            hasErrors("client", "password", "required")
                          }
                          data-validate='["required"]'
                          value={newClientForm.client.password}
                        />
                        {hasErrors("client", "password", "required") && (
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
                            hasErrors("client", "password_confirmation", "required")
                          }
                          data-validate='["required"]'
                          value={newClientForm.client.password_confirmation}
                        />
                        {hasErrors("client", "password_confirmation", "required") && (
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
                          user={client}
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

export default withNamespaces("translations")(ClientForm);
