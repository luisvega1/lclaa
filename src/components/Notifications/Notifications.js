import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { getNotifications, deleteNotification } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const Notifications = (props) => {

    const [data, setData] = useState([]);

    const notify = (title) => {
        toast(title, {
          type: "success",
          position: "bottom-center",
        });
    };

    const editButton = props => (
        <div className="text-center py-2">
            <Button color="warning" onClick={() => editNotification(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteNotificationFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const editNotifications = ({value}) => {
        props.history.push(`/notifications/${value}`)
    }

    const deleteNotificationsFunction = async ({value}) => {
        Swal({
            title: "Do you want to delete Notification?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteNotification(value).then( () => {
                    let notifications = [...data];
                    setData(notifications.filter( (notification) => notification.id !== value));
                    notify("Notifications eliminated.");
                }).catch( (error) => {
                    Swal(error.data, {
                        icon: "warning",
                    });
                })
            }
          });
    }

    const rowGetter = (i) => data[i]

    const columns = [
        
        {key: 'title', name: 'Title'},
        {key: 'body', name: 'Body'},
        {key: 'created_at', name: 'Created'},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchNotifications() {
            await getNotifications().then( (result) => {
                setData(result.data)
            });
        }

        fetchNotifications();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Notifications</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/notifications/new')}> <i class="fas fa-plus"></i> Create Notifications</Button>
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

export default Notifications;