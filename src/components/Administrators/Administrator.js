import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getAdministrators, deleteAdministrator } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const Administrators = (props) => {

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
        props.history.push(`/administrators/${value}`)
    }

    const deleteSpeakeFunction = async ({value}) => {
        Swal({
            title: "Do you want to delelte this administrator?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteAdministrator(value).then( () => {
                    let speakers = [...data];
                    setData(speakers.filter( (speaker) => speaker.id !== value));
                    notify("Administrator deleted.");
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
        {key: 'name', name: 'Name'},
        {key: 'lastname', name: 'Lastname'},
        {key: 'phone_num', name: 'Phone number'},
        {key: 'state', name: 'State'},
        {key: 'city', name: 'City'},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchadministrator() {
            await getAdministrators().then( (result) => {
                setData(result.data)
            });
        }

        fetchadministrator();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Administrators</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/administrators/new')}> <i class="fas fa-plus"></i> Create Administrator</Button>
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

export default Administrators;