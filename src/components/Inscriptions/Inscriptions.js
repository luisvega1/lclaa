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
                setInscriptions(response.data);
            })
        }
        getInscriptionsAPI()
    }, []);

    const paidFormatter = ({value}) => (
        value ? 
        <div className="text-center">
            <em style={{color: "#27c24c"}} className="fas fa-check"></em>
        </div> : 
        <div className="text-center">
            <em style={{color: "#DE350B"}} className="fas fa-times"></em>
        </div>
    )

    const valueFormatter = (obj) => (
        <div className="text-center">
            <em>{obj.value.name}</em>
        </div>
    )

    const dateFormatter = (obj) => (
        <div className="text-center">
            <em>{obj.value.date}</em>
        </div>
    )

    const rowGetter = (i) => inscriptions[i];

    const columns = [
        {key: 'name', name: 'Name'},
        {key: 'event', name: 'Event', formatter: valueFormatter},
        {key: 'event', name: 'Date', formatter: dateFormatter},
        {key: 'paid', name: 'paid', width: 80, formatter: paidFormatter},
        {key: 'charge_id', name: 'Charge Id', width: 80}
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