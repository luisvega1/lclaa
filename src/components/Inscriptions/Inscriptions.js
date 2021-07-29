import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import ReactDataGrid from 'react-data-grid';
import ContentWrapper from '../Layout/ContentWrapper';
import { getInscriptions } from '../../services/Services'

const Inscriptions = () => {

    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        async function getInscriptionsAPI() {
            await getInscriptions().then( (response) => {
                setInscriptions(response);
            })
        }
        getInscriptionsAPI()
    }, []);

    const rowGetter = (i) => inscriptions[i]

    const columns = [
        {key: 'name', name: 'Name'},
        {key: 'description', name: 'Description'},
        {key: 'date', name: 'Job'},
        {key: 'start_time', name: 'Start time', width: 80},
        {key: 'end_time', name: 'End time', width: 80}
    ];

    return (
        <ContentWrapper>
            <div className="content-heading">
                <div>Inscriptions</div>
            </div>
            <Container className="shadow">
                <ReactDataGrid
                    columns={columns}
                    rowGetter={rowGetter}
                    rowsCount={inscriptions.length}
                    rowHeight={50}
                    minHeight={700} />
            </Container>
        </ContentWrapper>
    )
}

export default Inscriptions;