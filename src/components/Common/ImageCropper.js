import React, { useState, useEffect } from 'react';
import { FILES_ENDPOINT } from '../../services/Services';
import ReactCrop from 'react-image-crop';
import { Row,  Col, Input, Container, Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({type, user, imageGetter}) => {
    const [modal, setModal] = useState(false);
    const [src, selectFile] = useState(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({
        aspect: type === 'avatar' ? 1/1 : type === 'banner' ? 16/9 : 1/1,
        unit: 'px',
        width: type === 'avatar' ? 400 : type === 'banner' ? 650 : 400,
        height: type === 'avatar' ? 400 : type === 'banner' ? 350 : 400,
        ruleOfThirds: true
    });

    //PARA ABRIR Y CERRAR MODAL DEL CROP
    const toggle = () => setModal(!modal);

    //PARA SELECCIONAR IMAGEN Y SETEARLA EN EL CROPPER
    const handleFileChange = e => {
        //VALIDA SI EL USUARIO NO SELECCIONO ALGUN ARCHIVO
        if(e.target.value.length > 0){
            const file = URL.createObjectURL(e.target.files[0]);
            selectFile(file);
            toggle()
        }
    }

    //CROPPER PARA IMAGEN
    const cropHandler = (e) => {
        setCrop(e)
    }

    //PONER IMAGENES DEFAULT DEL USUARIO (LAS QUE YA TIENE)
    const setDefaultImages = () => {
        type === 'avatar' ? setImage(`${FILES_ENDPOINT}${user.avatar}`) : type === 'banner' ? setImage(`${FILES_ENDPOINT}${user.banner}`) : setImage(`${FILES_ENDPOINT}${user.image}`);
    }

    useEffect( () =>{
        user && setDefaultImages();
    }, [user]);

    //OBTIENE LA IMAGEN YA RECORTADA
    const getCroppedImg = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
      
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        const base64image = canvas.toDataURL('image/png');
        const base64 = cleanBase64(base64image); 
        setImage(base64image);
        imageGetter(base64, type);
        toggle();
    }

    const cleanBase64 = (base64) => {
        return base64.split(',')[1];
    }

    //CIERRA MODAL AL CANCELAR Y RESETEA VALORES
    const closeModal = () => {
        toggle();
        setDefaultImages();
        selectFile(null);
    }

    return (
        <Container>
            {
                type === 'avatar' ? (
                <Row>
                    <Col xl={{size: 6, offset: 3}}  className="d-flex flex-column align-items-center">
                        <h3>Avatar</h3>
                        <img src={image} className={type === 'avatar' ? 'img-fluid rounded-circle shadow mb-3' : 'img-fluid rounded shadow mb-3'} width={400} heigth={400} alt="avatar" />
                        <label htmlFor="inputImage" title="Upload image file" className="btn btn-info btn-upload shadow">
                            <Input id="inputImage" name="file" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                            <span title="Import image with Blob URLs" className="docs-tooltip">
                                Select Image
                            </span>
                        </label>
                    </Col>
                </Row> 
                ) : type === 'banner' ? (
                <Row>
                    <Col xl={{size: 6, offset: 3}}  className="d-flex flex-column align-items-center">
                        <h3>Banner</h3>
                        <img src={image} className={type === 'avatar' ? 'img-fluid rounded-circle shadow mb-3' : 'img-fluid rounded shadow mb-3'} width={650} heigth={350} alt="banner" />
                        <label htmlFor="inputBanner" title="Upload image file" className="btn btn-info btn-upload shadow">
                            <Input id="inputBanner" name="file" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                            <span title="Import image with Blob URLs" className="docs-tooltip">
                                Select Image
                            </span>
                        </label>
                    </Col>
                </Row>
                ) : (
                <Row>
                    <Col xl={{size: 6, offset: 3}}  className="d-flex flex-column align-items-center">
                        <h3>Image</h3>
                        <img src={image} className={type === 'avatar' ? 'img-fluid rounded-circle shadow mb-3' : 'img-fluid rounded shadow mb-3'} width={400} heigth={400} alt="image" />
                        <label htmlFor="inputImage" title="Upload image file" className="btn btn-info btn-upload shadow">
                            <Input id="inputImage" name="file" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                            <span title="Import image with Blob URLs" className="docs-tooltip">
                                Select Image
                            </span>
                        </label>
                    </Col>
                </Row> )
            }
            {/* Crop Modal */}
            <Modal isOpen={modal} toggle={toggle} size='lg' >
                <ModalBody className="text-center">
                    {src && (
                        <ReactCrop className="img-fluid" src={src} onImageLoaded={setImage} crop={crop} onChange={cropHandler} />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="shadow" onClick={getCroppedImg}>Aceptar</Button>
                    <Button color="danger" className="shadow" onClick={closeModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>
            {/* Crop Modal End*/}
        </Container>
    )
}

export default ImageCropper;