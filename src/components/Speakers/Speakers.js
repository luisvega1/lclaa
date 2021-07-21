import React, { useState, useEffect } from "react";
import ImageCropper from "../Common/ImageCropper";
import ContentWrapper from "../Layout/ContentWrapper";
import FormValidator from '../../store/reducers/FormValidator';
import { newSpeaker } from '../../services/Services';
import { withNamespaces } from "react-i18next";
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
import Swal from 'sweetalert';

const Speaker = (props) => {

    const [user, setUser] = useState(null);
    //FORM DEL SPEAKER
    const [newSpeakerForm, setNewSpeakerForm] = useState({
        speaker: {
            name: '',
            description: '',
            job: '',
            banner: '',
            avatar: ''
        },
        errors: {}
    });

    //HACE LA VALIDACION DE LOS CAMPOS CADA QUE SE TECLEA
    const validateOnChange = event => {
        const input = event.target;
        const form = input.form;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        const result = FormValidator.validate(input);

        setNewSpeakerForm({
            speaker: {
                ...newSpeakerForm.speaker,
                [input.name]: value,
            },
            errors: {
                ...newSpeakerForm.errors,
                [input.name]: result
            }
        });
    }

    //VERIFICA SI HAY ERRORES
    const hasErrors = (formName, inputName, method) => {
        return  newSpeakerForm &&
                newSpeakerForm.errors &&
                newSpeakerForm.errors[inputName] &&
                newSpeakerForm.errors[inputName][method]
    }

    //METODO PARA OBTENER IMAGENES DEL COMPONENTE ImageCropper
    const getImage = (image, type) =>{
      setNewSpeakerForm({
        speaker: {
          ...newSpeakerForm.speaker,
          [type]: image
        }
      });
    }

    //ENVIAR REQUEST
    const submitNewSpeaker = async (e) => {
      e.preventDefault()

      const form = e.target;
      const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName));
      const { errors } = FormValidator.bulkValidate(inputs)

      setNewSpeakerForm({
            [form.name]: {
                ...newSpeakerForm[form.name]
            },
            errors
        });

        //Validate if is valid make api request
        await newSpeaker(newSpeakerForm).then( async (response) => {
            if(!response.error){
                console.log(response);
            }else{
                Swal({
                    title: '¡Alerta!',
                    icon: 'warning',
                    text: response.data.message
                })
            }
        })
    }

    //SE EJECUTA AL INICIAR
    useEffect( () => {
        const user = JSON.parse(sessionStorage.getItem("USERSESSION"));
        setUser(user);
    }, [])

  return (
      
    <ContentWrapper>
      <div className="content-heading">
        <div>Speaker</div>
      </div>
      <Row>
        <Col xs={12} className="text-center">
          <Card className="p-3 shadow">
            <CardHeader className="text-left mb-4">Nuevo Speaker</CardHeader>
            <CardBody>
              <form className="form-horizontal" name="speaker" onSubmit={submitNewSpeaker}>
                <Row>
                  <Col xl={6}>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Nombre</label>
                      <div className="col-xl-8">
                        <Input onChange={validateOnChange} type="text" name="name" invalid={hasErrors('speaker', 'name','required')} data-validate='["required"]' />
                        { hasErrors('speaker','name','required') && <span className="invalid-feedback">Campo requerido</span> }
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">Puesto</label>
                      <div className="col-xl-8">
                        <Input onChange={validateOnChange} type="text" name="job" invalid={hasErrors('speaker', 'job','required')} data-validate='["required"]' />
                        { hasErrors('speaker','job','required') && <span className="invalid-feedback">Campo requerido</span> }
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xl={6}>
                    <FormGroup row>
                      <label className="col-xl-4 col-form-label">
                        Descripción
                      </label>
                      <div className="col-xl-8">
                        <Input onChange={validateOnChange} type="textarea" name="description" invalid={hasErrors('speaker', 'description','required')} data-validate='["required"]' />
                        { hasErrors('speaker','description','required') && <span className="invalid-feedback">Field is required</span> }
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xl={5}>
                    <ImageCropper imageGetter={getImage} id="av" type="avatar" user={user} />
                  </Col>
                  <Col xl={7}>
                    <ImageCropper imageGetter={getImage} id="ban" type="banner" user={user} />
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col xl={12} className="d-flex flex-row justify-content-end">
                    <Button type="submit" color="primary" className="shadow">Guardar</Button>
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

export default withNamespaces("translations")(Speaker);
