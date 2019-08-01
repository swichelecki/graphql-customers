import React, { Component, Fragment } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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

const DELETE_CUSTOMER = gql`
    mutation DeleteCustomer($id: String!) {
        deleteCustomer(id: $id) {
            name
            email
            age
            id
        }
    }
`;

export class CustomersList extends Component {

    render() {

        return (
            <Fragment>
                <h1 className="display-4 my-3">Customers</h1>
                <Query query={CUSTOMERS_LIST_QUERY}>
                {
                    ({ loading, error, data }) => {
                        if(loading) return <h4>Loading...</h4>;
                        if(error) console.log(error);

                        return <Fragment>
                        {
                            data.customers.map(customer => (
                                <EachCustomer key={customer.id} customer={customer} editCustomer={this.props.editCustomer}/>
                            ))
                        }
                        </Fragment>
                    }
                }
                </Query>
            </Fragment>
        )

    }

}

export class EachCustomer extends Component {

    render() {

        const delete_id = {id: ''}

        const { name, email, age, id } = this.props.customer

        return(
            <div className="card card-body mb-3 list-item" id={id}>
                <div className="row">
                    <div className="col-md-9">
                        <h4>Customer: { name }</h4>
                        <p>Email: { email }</p>
                        <p>Age: { age }</p>
                    </div>
                    <div className="col-md-3">
                    <button onClick={this.props.editCustomer.bind(this, id)} className="btn btn-secondary m-1 text-success">Edit</button>
                    <Mutation
                        mutation={DELETE_CUSTOMER}
                        update={(cache, { data: { deleteCustomer } }) => {
                            const { customers } = cache.readQuery({ query: CUSTOMERS_LIST_QUERY });
                            cache.writeQuery({
                                query: CUSTOMERS_LIST_QUERY,
                                data: { customers: customers.filter(n => n.id !== delete_id.id) },
                            });
                        }}
                        >
                    {(deleteCustomer) => (
                        <button
                            onClick={(e) => {
                                delete_id.id = id
                                deleteCustomer({ variables: { id } })
                                }
                            }
                        className="btn btn-secondary m-1 text-danger">Delete</button>
                        )
                    }
                    </Mutation>
                    </div>
                </div>
            </div>

        )

    }

}

export default CustomersList;
