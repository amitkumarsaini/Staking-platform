import React from 'react'
import { Container, Table } from 'react-bootstrap'
import ButtonCustom from '../../../common/buttonCustom/ButtonCustom'
import HeaderAdmin from '../../../common/HeaderAdmin/HeaderAdmin'
import Wrapper from  '../../../common/wrapper/Wrapper'


const SetCurrencies =()=> {
    return (
        <Wrapper
        admin_wrap
        >
            <Container className="table_style" fluid>
                <HeaderAdmin
                    title="Set Currencies"
                >
                    <ButtonCustom 
                        title="Add Currency"                        
                    />
                </HeaderAdmin>
                <Table responsive>
                    <thead>
                        <tr>
                        <th>#</th>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <th key={index}>Table heading</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                        </tr>
                        <tr>
                        <td>2</td>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                        </tr>
                        <tr>
                        <td>3</td>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <td key={index}>Table cell {index}</td>
                        ))}
                        </tr>
                    </tbody>
                </Table> 
            </Container>
        </Wrapper>
        
        
    )
}

export default SetCurrencies
