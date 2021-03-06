import React, { Component } from 'react';
import Web3 from 'web3'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      this.setState({ products: [] })
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

   
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('transactionHash', (hash) => {
      this.setState({ loading: false })
      this.loadBlockchainData();
    })
    window.alert('Initiating listing of your Product "' + name + '"')
  }

  purchaseProduct = async (id, price) => {
    window.alert('Initiating Purchase, make sure you have ' + window.web3.utils.fromWei(price.toString(), 'Ether') + ' ETH in your wallet!')
    this.setState({ loading: true })
    await this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('transactionHash', (hash) => {
      this.setState({ loading: false })
      this.loadBlockchainData();
    })
  }

  resaleProduct(id, price) {
    this.setState({ loading: true })
    let newprice = prompt('Enter new price', window.web3.utils.fromWei(price.toString(), 'Ether'))
    this.state.marketplace.methods.resaleProduct(id, window.web3.utils.toWei(newprice, 'Ether')).send({ from: this.state.account })
    .once('transactionHash', (hash) => {
      this.setState({ loading: false })
      this.loadBlockchainData();
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
      
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.resaleProduct = this.resaleProduct.bind(this)

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main
                products={this.state.products}
                createProduct={this.createProduct}
                purchaseProduct={this.purchaseProduct}
                resaleProduct = {this.resaleProduct}
                account={this.state.account}
                 />
            }
          </main>
</div>
        </div>
      </div>
    );
  }
}

export default App;