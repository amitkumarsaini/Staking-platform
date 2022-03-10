import React, {Component} from 'react'
import Select from 'react-select';
import {Link} from 'react-router-dom'
import {Row} from 'react-bootstrap'
import './Coinlink.css'
const options = [
    {value: 1, label: 'DeFi Coins'},
    {value: 2, label: 'Chain Coins'},
    {value: 3, label: 'NFT Coins'},
];
export class Coinlink extends Component {
    state = {
        selectedOption: this.props.coinType,
    };
    handleChange = selectedOption => {
        this.setState({selectedOption});
        if (selectedOption.value === 1) {
            this.props.history.push('/coins/defi')
        } else if (selectedOption.value === 2) {
            this.props.history.push('/coins/chain')
        } if (selectedOption.value === 3) {
            this.props.history.push('/coins/nft')
        }

        console.log(`Option selected:`, selectedOption);
    };
    render() {
        const {selectedOption} = this.state;
        return (

            <ul className="linkGroup_style coin-group">
                <li className={`isActiveLeft ${this.props.cstyle}`}>
                    <Select
                        defaultValue={
                            options.filter(option =>
                                option.value === selectedOption)
                        }
                        onChange={this.handleChange}
                        options={options}
                        placeholder="Select Coins"
                    // menuIsOpen={true}
                    // <td><img src={graph} /></td>
                    />
                    <img src={this.props.iconleft} />
                </li>
                <li className={`isActiveLeft ${this.props.cstyles}`} onClick={this.props.changePlatForm}>
                    <span >{this.props.rightbtn_title} <img src={this.props.iconright} /></span>
                </li>
            </ul>

        )
    }
}

export default Coinlink
