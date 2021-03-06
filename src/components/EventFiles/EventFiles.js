import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getFiles, deleteFile } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const EventFiles = (props) => {

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
            <Button color="warning" onClick={() => editFile(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteFileFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const fileButton = ({value}) => (
        <div className="text-center py-2">
            <em style={{fontSize: 18, cursor: 'pointer'}} onClick={() => window.open(`${FILES_ENDPOINT}${value}`,'_blank')} class="far fa-file-alt"></em>
        </div>
    )

    const editFile = ({value}) => {
        props.history.push(`/files/${value}`)
    }

    const deleteFileFunction = async ({value}) => {
        Swal({
            title: "Do you want to delete this File?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteFile(value).then( () => {
                    let files = [...data];
                    setData(files.filter( (file) => file.id !== value));
                    notify("File deleted.");
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
        {key: 'name', name: 'Name'},
        {key: 'description', name: 'Description'},
        {key: 'file', name: 'File', formatter: fileButton, width: 80},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchFilesApi() {
            await getFiles().then( (result) => {
                setData(result.data)
            });
        }

        fetchFilesApi();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Event Files</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/files/new')}> <i class="fas fa-plus"></i> Upload new File</Button>
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

export default EventFiles;