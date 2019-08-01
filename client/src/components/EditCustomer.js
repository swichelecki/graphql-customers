import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

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

const EDIT_CUSTOMER = gql`
    mutation editCustomer($name: String!, $email: String!, $age: Int!, $id: String!) {
        editCustomer(name: $name, email: $email, age: $age, id: $id) {
            name
            email
            age
            id
        }
    }
`;

const GET_CUSTOMER = gql`
    query Customer($id: String!) {
        customer(id: $id) {
            name
            email
            age
            id
        }
    }
`;

export class EditCustomer extends Component {

    render() {

        const editCustomer = this.props.editId;
        let id = editCustomer;

        return(
            <Fragment>
                <h1 className="display-4 my-3">Edit Customer</h1>
                <Query query={GET_CUSTOMER} variables={{ id }}>
                {
                    ({ loading, error, data }) => {
                        if(loading) return <h4>Loading...</h4>;
                        if(error) console.log(error);

                        return <EditForm customerData={data} />
                    }
                }
                </Query>
            </Fragment>
        )
    }
}

export class EditForm extends Component {

    constructor(props){
        super();
        this.state = {
            name: props.customerData.customer.name,
            email: props.customerData.customer.email,
            age: props.customerData.customer.age,
            id: props.customerData.customer.id
        }

    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.name === "age" ? parseInt(e.target.value) : e.target.value });

    render() {

        const { name, email, age, id } = this.state;

        return(
            <div className="card card-body mb-3">
                <Mutation
                    mutation={EDIT_CUSTOMER}
                    update={(cache, { data: { editCustomer } }) => {
                        const { customers } = cache.readQuery({ query: CUSTOMERS_LIST_QUERY });

                        customers.forEach(item => {
                            if (item.id === id) {
                                item = editCustomer
                            }
                        });

                        cache.writeQuery({
                            query: CUSTOMERS_LIST_QUERY,
                            data: { customers: customers},
                            });
                        }
                    }
                >
                {(editCustomer) => (
                <form onSubmit={(e) => {
                        e.preventDefault();
                        editCustomer({ variables: { name, email, age, id } })
                        this.setState({
                            name: '',
                            email: '',
                            age: '',
                            id: ''
                        })
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
        )
    }
}

export default EditCustomer;
