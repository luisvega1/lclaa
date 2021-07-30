import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Button, Container } from 'reactstrap';
import ContentWrapper from "../Layout/ContentWrapper";
import { FILES_ENDPOINT, getCheckers, deleteChecker } from '../../services/Services';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert';

const Checkers = (props) => {

    const [data, setData] = useState([]);

    const notify = (title) => {
        toast(title, {
          type: "success",
          position: "bottom-center",
        });
    };

    const editButton = props => (
        <div className="text-center py-2">
            <Button color="warning" onClick={() => editChecker(props)}> <i className="far fa-edit"></i> </Button>
        </div>
    )

    const deleteButton = props => (
        <div className="text-center py-2">
            <Button color="danger" onClick={() => deleteCheckerFunction(props)}> <i class="far fa-trash-alt"></i> </Button>
        </div>
    )

    const editChecker = ({value}) => {
        props.history.push(`/checkers/${value}`)
    }

    const deleteCheckerFunction = async ({value}) => {
        Swal({
            title: "Do you want to delete this checker?",
            text: "Once deleted, the information cannot be recovered.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
                await deleteChecker(value).then( () => {
                    let checkers = [...data];
                    setData(checkers.filter( (checker) => checker.id !== value));
                    notify("Checker deleted.");
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
        {key: 'lastname', name: 'Lastname'},
        {key: 'email', name: 'Email'},
        {key: 'phone_num', name: 'Phone number'},
        {key: 'state', name: 'State'},
        {key: 'city', name: 'City'},
        {key: 'id', name: 'Edit', formatter: editButton, width: 80},
        {key: 'id', name: 'Delete', formatter: deleteButton, width: 80}
    ];

    useEffect( () => {
        async function fetchCheckersAPI() {
            await getCheckers().then( (result) => {
                setData(result.data)
            });
        }

        fetchCheckersAPI();
    }, [])

    return(
        <ContentWrapper>
            <div className="content-heading">
                <div>Checkers</div>
            </div>
            <div className="text-right mb-3">
                <Button color="primary" className="shadow rounded-pill" onClick={ () => props.history.push('/checkers/new')}> <i class="fas fa-plus"></i> Create Checker</Button>
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

export default Checkers;