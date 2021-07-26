import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getEvents, deleteEvent } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const Events = (props) => {

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
            <Button color="warning" onClick={() => editEvent(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteEventFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const editEvent = ({value}) => {
        props.history.push(`/events/${value}`)
    }

    const deleteEventFunction = async ({value}) => {
        Swal({
            title: "Do you want to delete this Event?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteEvent(value).then( () => {
                    let events = [...data];
                    setData(events.filter( (event) => event.id !== value));
                    notify("Event deleted.");
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
        {key: 'date', name: 'Date'},
        {key: 'address', name: 'Address'},
        {key: 'description', name: 'Description'},
        {key: 'speaker_ids', name: 'Speakers'},
        {key: 'sponsor_ids', name: 'Sponsors'},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchEventsAPI() {
            await getEvents().then( (result) => {
                setData(result.data)
            });
        }

        fetchEventsAPI();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Events</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/events/new')}> <i class="fas fa-plus"></i> Create Exposition</Button>
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

export default Events;