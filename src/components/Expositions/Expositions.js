import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getExpositions, deleteExposition } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const Expositions = (props) => {

    const [data, setData] = useState([]);

    const notify = (title) => {
        toast(title, {
          type: "success",
          position: "bottom-center",
        });
    };

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
            <Button color="warning" onClick={() => editExposition(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteExpositionFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const editExposition = ({value}) => {
        props.history.push(`/expositions/${value}`)
    }

    const deleteExpositionFunction = async ({value}) => {
        Swal({
            title: "Do you want to delete this Exposition?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteExposition(value).then( () => {
                    let expositions = [...data];
                    setData(expositions.filter( (exposition) => exposition.id !== value));
                    notify("Exposition deleted.");
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
        {key: 'name', name: 'Name'},
        {key: 'description', name: 'Description'},
        {key: 'date', name: 'Job'},
        {key: 'start_time', name: 'Start time', width: 80},
        {key: 'end_time', name: 'End time', width: 80},
        {key: 'speaker_ids', name: 'Speakers'},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchExpositionsAPI() {
            await getExpositions().then( (result) => {
                setData(result.data)
            });
        }

        fetchExpositionsAPI();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Expositions</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/expositions/new')}> <i class="fas fa-plus"></i> Create Exposition</Button>
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

export default Expositions;