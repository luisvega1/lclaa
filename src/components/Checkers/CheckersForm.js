import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newChecker,
  getChecker,
  updateChecker,
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

const CheckersForm = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [checker, setChecker] = useState(null);
  //FORM DEL CHECKER
  const [newCheckerForm, setnewCheckerForm] = useState({
    checker: {
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

    setnewCheckerForm({
      checker: {
        ...newCheckerForm.checker,
        [input.name]: value,
      },
      errors: {
        ...newCheckerForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newCheckerForm &&
      newCheckerForm.errors &&
      newCheckerForm.errors[inputName] &&
      newCheckerForm.errors[inputName][method]
    );
  };


  //ENVIAR REQUEST
  const submitnewChecker = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setnewCheckerForm({
      checker: {
        ...newCheckerForm.checker,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newChecker(newCheckerForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Checker created.");
          setnewCheckerForm({
            checker: {
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
            text: error.data,
          });
        });
    } else {
      await updateChecker({ checker: newCheckerForm.checker }, checker.id)
        .then(() => {
          //USUARIO MODIFICADO CORRECTAMENTE
          notify("Checker modified.");
          setnewCheckerForm({
            checker: {
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
    async function getCheckerAPI() {
      await getChecker(props.match.params.id)
        .then((result) => {
          console.log(result.data);
          setChecker(result.data);
          setnewCheckerForm({
            checker: { ...result.data },
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
      setChecker(user);
    } else {
      setEditMode(true);
      getCheckerAPI();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Checker registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Checker" : "Modify Checker"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="checker"
                onSubmit={submitnewChecker}
              >
                <Row>
                  <Col xl={12}>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Name</label>
                      <div className="col-xl-8">
                        <Input
                          onChange={validateOnChange}
                          type="text"
                          name="name"
                          invalid={hasErrors("checker", "name", "required")}
                          data-validate='["required"]'
                          value={newCheckerForm.checker.name}
                        />
                        {hasErrors("checker", "name", "required") && (
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
                          invalid={hasErrors("checker", "lastname", "required")}
                          data-validate='["required"]'
                          value={newCheckerForm.checker.lastname}
                        />
                        {hasErrors("checker", "lastname", "required") && (
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
                            hasErrors("checker", "email", "required") ||
                            hasErrors("checker", "email", "email")
                          }
                          data-validate='["required","email"]'
                          value={newCheckerForm.checker.email}
                        />
                        {hasErrors("checker", "email", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("checker", "email", "email") && (
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
                            hasErrors("checker", "phone_num", "required") ||
                            hasErrors("checker", "phone_num", "number")
                          }
                          data-validate='["required","email"]'
                          value={newCheckerForm.checker.phone_num}
                        />
                        {hasErrors("checker", "phone_num", "required") && (
                          <span className="invalid-feedback">
                            Required field
                          </span>
                        )}
                        {hasErrors("checker", "phone_num", "number") && (
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
                          invalid={hasErrors("checker", "state", "required")}
                          data-validate='["required"]'
                          value={newCheckerForm.checker.state}
                        />
                        {hasErrors("checker", "lastname", "required") && (
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
                            hasErrors("checker", "city", "required")
                          }
                          data-validate='["required"]'
                          value={newCheckerForm.checker.city}
                        />
                        {hasErrors("checker", "city", "required") && (
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
                            hasErrors("checker", "password", "required")
                          }
                          data-validate='["required"]'
                          value={newCheckerForm.checker.password}
                        />
                        {hasErrors("checker", "password", "required") && (
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
                            hasErrors("checker", "password_confirmation", "required")
                          }
                          data-validate='["required"]'
                          value={newCheckerForm.checker.password_confirmation}
                        />
                        {hasErrors("checker", "password_confirmation", "required") && (
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

export default withNamespaces("translations")(CheckersForm);
