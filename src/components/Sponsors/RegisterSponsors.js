import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from "../../store/reducers/FormValidator";
import {
  newSponsor,
  getSponsor,
  updateSponsor,
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

const RegisterSponsor = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  //FORM DEL ADMINSITRADOR
  const [newSponsorForm, setNewSponsorForm] = useState({
    sponsor: {
      name: "",
      description: "",
      avatar: "",
      banner: ""
    },
    errors: {},
  });

  //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
  const validateOnChange = (event) => {
    const input = event.target;
    const value = input.type === "checkbox" ? input.checked : input.value;
    const result = FormValidator.validate(input);

    setNewSponsorForm({
      sponsor: {
        ...newSponsorForm.sponsor,
        [input.name]: value,
      },
      errors: {
        ...newSponsorForm.errors,
        [input.name]: result,
      },
    });
  };

  //VERIFICA SI HAY ERRORES
  const hasErrors = (inputName, method) => {
    return (
      newSponsorForm &&
      newSponsorForm.errors &&
      newSponsorForm.errors[inputName] &&
      newSponsorForm.errors[inputName][method]
    );
  };

  //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
  const getImage = (image, type) => {
    setNewSponsorForm({
      sponsor: {
        ...newSponsorForm.sponsor,
        [type]: image,
      },
    });
  };

  //ENVIAR REQUEST
  const submitNewSponsor = async (e) => {
    e.preventDefault();

    const form = e.target;
    const inputs = [...form.elements].filter((i) =>
      ["INPUT", "SELECT"].includes(i.nodeName)
    );
    const { errors } = FormValidator.bulkValidate(inputs);

    setNewSponsorForm({
      sponsor: {
        ...newSponsorForm.sponsor,
      },
      errors,
    });

    //Validate if is valid make api request
    if (!editMode) {
      await newSponsor(newSponsorForm)
        .then(async (response) => {
          //USUARIO CREADO CORRECTAMENTE
          notify("Sponsor created.");
          setNewSponsorForm({
            sponsor: {
              name: "",
              description: "",
              avatar: "",
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
      await updateSponsor({ sponsor: newSponsorForm.sponsor }, user.id)
        .then(() => {
          //SPONSOR MODIFICADO CORRECTAMENTE
          notify("Sponsor modified.");
          setNewSponsorForm({
            sponsor: {
              name: "",
              description: "",
              avatar: "",
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

  //SE EJECUTA AL INICIAR
  useEffect(() => {
    async function getSponsorAPI() {
      await getSponsor(props.match.params.id)
        .then((result) => {
          setUser(result.data);
          setNewSponsorForm({
            sponsor: { ...result.data },
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
      setUser(user);
    } else {
      setEditMode(true);
      getSponsorAPI();
    }
  }, []);

  return (
    <ContentWrapper>
      <div className="content-heading">
        <div>
          {!editMode ? "Sponsor registration" : "Update information"}
        </div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">
              {!editMode ? "New Sponsor" : "Modify Sponsor"}
            </CardHeader>
            <CardBody>
              <form
                className="form-horizontal"
                name="sponsor"
                onSubmit={submitNewSponsor}
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
                          invalid={hasErrors("sponsor", "name", "required")}
                          data-validate='["required"]'
                          value={newSponsorForm.sponsor.name}
                        />
                        {hasErrors("sponsor", "name", "required") && (
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
                          invalid={hasErrors("sponsor", "description", "required")}
                          data-validate='["required"]'
                          value={newSponsorForm.sponsor.description}
                        />
                        {hasErrors("sponsor", "description", "required") && (
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

export default withNamespaces("translations")(RegisterSponsor);
