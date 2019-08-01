import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

const ADD_CUSTOMER_QUERY = gql`
    mutation AddCustomerQuery($name: String!, $email: String!, $age: Int!) {
        addCustomer(name: $name, email: $email, age: $age) {
            name
            email
            age
            id
        }
    }
`;

const CUSTOMERS_LIST_QUERY = gql`
    query CustomersListQuery {
        customers {
            name
            email
            age
            id
        }
    }
`;

export class AddCustomer extends Component {

    state = {
        name: '',
        email: '',
        age: ''
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.name === "age" ? parseInt(e.target.value) : e.target.value });

    render() {

        const { name, email, age } = this.state;

        return (
            <Fragment>
                <h1 className="display-4 my-3">Add Customer</h1>
                <div className="card card-body mb-3">
                <Mutation
                    mutation={ADD_CUSTOMER_QUERY}
                    update={(cache, { data: { addCustomer } }) => {
                        const { customers } = cache.readQuery({ query: CUSTOMERS_LIST_QUERY });
                        cache.writeQuery({
                            query: CUSTOMERS_LIST_QUERY,
                            data: { customers: customers.concat(addCustomer) },
                            });
                        }
                    }
                >
                {(addCustomer) => (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addCustomer({ variables: { name, email, age } })
                        this.setState({
                            name: '',
                            email: '',
                            age: ''
                        });
                        }
                    }
                    className="row col-md-9">
                    <label>Name<br/>
                        <input type="text" value={this.state.name} onChange={this.onChange} name="name" className="m-1" style={{backgroundColor: '#888', border: 'none', padding: '.2rem'}}/>
                    </label>
                    <label>Email<br/>
                        <input type="text" value={this.state.email} onChange={this.onChange} name="email" className="m-1" style={{backgroundColor: '#888', border: 'none', padding: '.2rem'}}/>
                    </label>
                    <label>Age<br/>
                        <input type="text" value={this.state.age} onChange={this.onChange} name="age" className="m-1" style={{backgroundColor: '#888', border: 'none', padding: '.2rem'}}/>
                    </label>
                    <label><br/>
                    <input type="submit" value="Submit" className="btn btn-secondary m-1 text-success"/>
                    </label>
                    </form>
                    )
                }
                </Mutation>
                </div>
            </Fragment>
        )

    }

}

export default AddCustomer;
