import { Table } from 'react-bootstrap';
import styles from './styles/tableStyles';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

let url = "https://avatars3.githubusercontent.com/u/7412845?s=400&u=7fa4316e982391d46c84536eb54b375439e97f7b&v=4"

let json = [
    {
        url: "https://avatars3.githubusercontent.com/u/7412845?s=400&u=7fa4316e982391d46c84536eb54b375439e97f7b&v=4",
        name: 'blah',
        id: 1,
        cost: "Rs 500",
        number: 1
    },
    {
        url: "https://avatars3.githubusercontent.com/u/7412845?s=400&u=7fa4316e982391d46c84536eb54b375439e97f7b&v=4",
        name: 'blah1',
        id: 1,
        cost: "Rs 100",
        number: 1
    }
]

function getTableBody() {
    let body = [];
    for (let item of json) {
        body.push(
            <tr>
                <td><img style={{width: 100, height:100, borderRadius: 50}}src={item.url} alt="boohoo" className="img-responsive" /></td>
                <td>{item.name}</td>
                <td>{item.cost}</td>
                <td><input type='number' /></td>
            </tr>
        )
    }
    return body;
}
function DonateTable() {

    return (
        <div className="table">
            {/* <Table hover className="" style={{width: 100}}>
                <tbody>
                    {getTableBody(json)}
                    
                </tbody>
            </Table> */}

            <div>
            {getTableBody(json)}
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

export default DonateTable;