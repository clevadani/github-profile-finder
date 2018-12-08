import React, { Component } from 'react';
import axios from 'axios';
import './bootstrap.css';
import Item from './components/item';

class App extends Component {


  constructor() {
    super();
    this.state = {
      text: "",
      user: [],
      type: '',
      items: [],
      show: [],
      page: 1,
      pageLen: 0,
      display: false,
      error: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePaginate = this.handlePaginate.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({display: false});
    axios.get(`https://api.github.com/users/${this.state.text}`)
    .then(res => {
      const user = res.data;
      this.setState({
        user, 
        display: true,
        error: ''
      });
    })
    .catch(error => {
      this.setState({
        error: 'Error. Could not complete your request.'
      })
    })
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleClick(e) {
    this.setState({
      type: e.target.name,
      page: 1,
      pageLen: 0
    });
    if (e.target.name === 'overview') {
      this.setState({
        type: false
      })
    } else {

      axios.get(`https://api.github.com/users/${this.state.text}/${e.target.name}`)
      .then(res => {
        const items = res.data;
        this.setState({
          items,
          show: items.slice(0, 10)
        });
        if(items.length > 10) {
          this.setState({
            pageLen: items.length/10
          })
          
        }
      })
    }
  }

  handlePaginate(e){
    
    let start = Number((e.target.name -1) + '0');
    let end = Number(e.target.name + '0');
    this.setState({
      show: this.state.items.slice(start, end),
      page: e.target.name
    })
  }

  render() {
    let pageNums = [];
    if (this.state.pageLen) {
      for (var i = 1; i <= this.state.pageLen; i++) {
        pageNums.push(<li className={(Number(this.state.page) === i ? 'active': '')} key={i}><a onClick={this.handlePaginate} name={i}>{i}</a></li>)
      }
    }
    return (
      <div className="container">
        
          <header className="App-header">
            <h1 className="App-title">Github Profile Finder</h1>
          </header>
          <br />
          {!!this.state.error && <span className='alert alert-danger'>{this.state.error}</span>}
          <br /><br /><br />
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <input onChange={this.handleChange} name="text" className="form-control" type="text" placeholder="Search by username" aria-describedby="basic-addon2"/>
              <span className="input-group-btn">
                <button className="btn btn-outline-secondary" type="submit">Submit</button>
              </span>
            </div>
            <br/>
          </form>
        {this.state.display && (<div>
          <div className="row">
            <div className="col-sm-2 col-xs-4">
            <br/><br/>
              <img className="img-responsive" src={this.state.user.avatar_url} alt="Github Avatar" />
            </div>
            <div className="col-sm-10 col-xs-8">
              <h3>Name: {this.state.user.name}</h3>
              <br />

              <ul className="list-group">
                <li className="list-group-item"> <strong> Username:</strong> {this.state.user.login} </li>
                <li className="list-group-item"> <strong> Email:</strong> {this.state.user.email} </li>
                <li className="list-group-item"> <strong> Location:</strong> {this.state.user.location} </li>
                <li className="list-group-item"> <strong> Bio:</strong> {this.state.user.bio} </li>
                <li className="list-group-item"> <strong> Website:</strong> {this.state.user.blog} </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className='col-md-12'>
              <button onClick={this.handleClick} name='overview' className="btn" type="button">Overview</button>
              <button onClick={this.handleClick} name='repos' className="btn" type="button">Repositories</button>
              <button onClick={this.handleClick} name='starred' className="btn" type="button">Starred Repos</button>
              <button onClick={this.handleClick} name='followers' className="btn" type="button">Followers</button>
              <button onClick={this.handleClick} name='following' className="btn" type="button">Following</button>
            </div><br /><br /><br />
            <div className='col-md-12>'>
              {
                !!this.state.type === false &&(<ul className="list-group">
                <li className="list-group-item"> <strong> Public Repos:</strong> {this.state.user.public_repos} </li>
                <li className="list-group-item"> <strong> Public Gists:</strong> {this.state.user.public_gists} </li>
                <li className="list-group-item"> <strong> Following:</strong> {this.state.user.following} </li>
                <li className="list-group-item"> <strong> Followers:</strong> {this.state.user.followers} </li>
              </ul>)
              }
              <ul className='list-group'>
                {(this.state.type === 'repos') && this.state.show.map(item => <Item key={item.id} target={item.name} />)}
                {(this.state.type === 'starred') && this.state.show.map(item => <Item key={item.id} target={item.name} />)}
                {(this.state.type === 'following') && this.state.show.map(item => <Item key={item.id} target={item.login} />)}
                {(this.state.type === 'followers') && this.state.show.map(item => <Item key={item.id} target={item.login} />)}
              </ul>
              <ul className="pagination">
                {pageNums}
              </ul>
            </div>
          </div>
        </div>)}
      </div>
    );
  }
}

export default App;
