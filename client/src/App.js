import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import CustomersList from './components/CustomersList';
import AddCustomer from './components/AddCustomer';
import EditCustomer from './components/EditCustomer';
import './App.css';

const client = new ApolloClient({
    uri: '/graphql'
});

export class App extends Component {

    state = {
        id: ''
    }

    editThisCustomer = (id) => {

        if (id !== ''){

            this.state.id = ''
            this.setState({id: id})
            window.scrollTo(0,0)

        } else {

            this.setState({id: id})
            window.scrollTo(0,0)

        }

    }

    render() {

        return (
            <ApolloProvider client={client}>
            <div className="container">
                <AddCustomer />
                {this.state.id !== '' && <EditCustomer editId={this.state.id}/>}
                <CustomersList editCustomer={this.editThisCustomer} />
            </div>
            </ApolloProvider>
        );

    }

}

export default App;
