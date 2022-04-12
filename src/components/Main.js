import React, { Component } from 'react';
import './Main.css';

class Main extends Component {

  render() {
    return (
      <div id="content" className='container'>
        <h1 className='text-center font-weight-light mb-4'>Add New Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, price)
        }}>
          <div className='row mt-4 mb-4'>
              <div className='col-md-5'>
                <div className="form-group mr-sm-2">
                  <input
                    id="productName"
                    type="text"
                    ref={(input) => { this.productName = input }}
                    className="form-control"
                    placeholder="Product Name"
                    required />
                </div>
              </div>
              <div className='col-md-5'>
                <div className="form-group input-group mr-sm-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Ξ</span>
                  </div>
                  <input
                    id="productPrice"
                    type="text"
                    ref={(input) => { this.productPrice = input }}
                    className="form-control"
                    placeholder="Product Price"
                    aria-describedby="basic-addon1"
                    required />
                </div>
              </div>
              <div className='col-md-2'>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </div>
          </div>
        </form>

        <hr></hr>
        <h1 className='text-center font-weight-light'>Buy Product</h1>
        <table className="table table-striped">
          <thead className="tableHead">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price (Ξ)</th>
              <th scope="col">Owner</th>
              <th scope="col">Buy</th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.products.map((product, key) => {
            return(
              <tr className='font-weight-bold' key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td class='text-bold'>{product.name}</td>
                <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                <td>{product.owner}</td>
                <td>
                  { !product.purchased ? 
                    product.owner!=this.props.account ? 
                    <button
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          this.props.purchaseProduct(event.target.name, event.target.value)
                        }}
                      className="btn btn-outline-success">
                        Buy
                      </button>
                    : <button disabled className="btn btn-outline-warning">Your Product</button>
                    : <button disabled className="btn btn-outline-danger">Sold</button>
                  }
                  </td>
              </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;