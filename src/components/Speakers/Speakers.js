import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getSpeakers, deleteSpeaker } from '../../services/Services';
import Swal from 'sweetalert';

const Speakers = () => {

    const [data, setData] = useState([]);

    const ImageFormatter = props => (
        <div className="text-center py-2">
            <img src={`${FILES_ENDPOINT}${props.value}`} className="img-fluid thumb32" alt="avatar"/>
        </div>
    );

    const BannerFormatter = props => (
        <div className="text-center py-2">
            <img src={`${FILES_ENDPOINT}${props.value}`} className="img-fluid" width="50" alt="banner"/>
        </div>
    );

    const editButton = props => (
        <div className="text-center py-2">
            <Button color="warning" onClick={() => editSpeaker(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteSpeakeFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const editSpeaker = ({value}) => {
        console.log(value);
    }

    const deleteSpeakeFunction = async ({value}) => {
        Swal({
            title: "¿Deseas dar de baja al speaker?",
            text: "Una vez dado de baja, no se podrá recuperar si información.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteSpeaker(value).then( () => {
                    let speakers = [...data];
                    setData(speakers.filter( (speaker) => speaker.id != value));
                    Swal("Speaker eliminado.", {
                        icon: "success",
                      });
                }).catch( (error) => {
                    Swal(error.response.data.message, {
                        icon: "warning",
                    });
                })
            }
          });
    }

    const rowGetter = (i) => data[i]

    const columns = [
        {key: 'avatar', name: 'Avatar', formatter: ImageFormatter, width: 80},
        {key: 'banner', name: 'Banner', formatter: BannerFormatter, width: 120},
        {key: 'name', name: 'Nombre'},
        {key: 'description', name: 'Descripción'},
        {key: 'job', name: 'Puesto'},
        {key: 'id', name: 'Editar', formatter: editButton, width: 80},
        {key: 'id', name: 'Eliminar', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchSpeakers() {
            await getSpeakers().then( (result) => {
                setData(result.data)
            });
        }

        fetchSpeakers();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Speakers</div>
            </div>
            <Container fluid className="shadow">
                    <ReactDataGrid
                        columns={columns}
                        rowGetter={rowGetter}
                        rowsCount={data.length}
                        rowHeight={50}
                        minHeight={700} />
                </Container>
        </ContentWrapper>
    )
}

export default Speakers;