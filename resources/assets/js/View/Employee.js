import React, { Component } from 'react';
import { link } from 'react-router';
import Modal from 'react-modal';
import config from '../config';
import { browserHistory } from 'react-router';
import Pagination from "../components/pagination";
import SignOut from "./SignOut";

var $this;
var signOut;
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '50%',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor: "rgba(158, 134, 134, 0.75)",
  },
  overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      zIndex                : '5',
    },
};
Modal.setAppElement('#root');
class Employee extends Component {
  constructor(props) {
    super(props);
    $this = this;
    this.state = {  perPages:5
                    ,name: ''
                    ,empCode:''
                    ,phoneNo: ''
                    ,empTypeId: ''
                    ,branchStatus:''
                    ,salary: ''
                    ,searchName: ''
                    ,employee: ''
                    ,pagination: ''
                    ,emptypes: ''
                    ,id:''
                    ,edit: false
                    ,modalIsOpen: false
                    ,editmodalIsOpen: false};
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.createSubmit = this.createSubmit.bind(this);

    signOut = new SignOut();
    
  }
  componentWillMount() {
    this.setState({
        employee: {},
        pagination: {},
        formErrors: { 'name': '','empCode':'','branchStatus':'','phoneNo':'', 'empTypeId':'','id':'' ,'salary':''},
    })
  }
  componentDidMount(){
    $this.fetchData();
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = 'rgb(38, 101, 132)';
  }
  closeModal() {   
    this.setState({modalIsOpen: false, edit:false, id:'',branchStatus:'', name:'',empCode:'',phoneNo:'', empTypeId:'',salary:'', formErrors: { 'name': '','roomno':'','roomtype':''}});
  }

  handleOnChange(e){
    $this.setState({
      [e.target.name]: e.target.value
    })
  }
  filterList(event){
    $this.setState({searchName  : event.target.value.toLowerCase()});
  }
  fetchData(page =1){
    
    axios.get(config.baseurl+"employee?page="+page+"&name="+$this.state.searchName+"&perPages="+$this.state.perPages)
    .then(response => {
       
        $this.setState({ employee: response.data.employee.data }); 
        $this.setState({ pagination: response.data.pagination });
        $this.setState({ emptypes: response.data.emptypes });
    })
    .catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
    })
  }

  editData(obj){
    const id = obj.id;  
    $this.openModal();
    axios.get(config.baseurl+"employee/"+id+"/edit")
    .then(response => {
        status =response.data.emp_code.substring(1, 2) -1;
        console.log(status);
        $this.setState({ name: response.data.name
                        , empCode : response.data.emp_code
                        , branchStatus : status
                        , phoneNo:response.data.phone_no
                        , empTypeId:response.data.emptype_id
                        , salary:response.data.salary
                        , id:response.data.id ,edit:true}); 
    }).catch(function (error) {
        if(error.response.status == 401){
            signOut.signOut($this);
        }
    })
  }
  tabRow(){
    if($this.state.employee instanceof Array){
      return $this.state.employee.map(function(object, i){
          return <TableRow obj={object} key={i} editData={$this.editData}/>;
      })
    }
  }
  option(){
    if($this.state.emptypes instanceof Array){
      return $this.state.emptypes.map(function(type){
        return <option key={type.id} value={type.id}>{type.name}</option>;
      })
    }
  }
  createSubmit(e){
      e.preventDefault();
      const employee = {
        name: this.state.name,
        branchStatus:this.state.branchStatus,
        phoneNo: this.state.phoneNo,
        empTypeId: this.state.empTypeId,
        salary: this.state.salary,
        id: this.state.id
      }
      let uri = config.baseurl+'employee';
      axios.post(uri, employee).then((response) => {
        if(response.data.result==false){
            console.log(response.data.errors);
          $this.setState({ formErrors: response.data.errors });
          console.log(this.state.formErrors.name);
          return false;
        }else{
          
          $this.closeModal();
          $this.fetchData();
         
        }
      }).catch(function (error) {
        if(error.response.status == 401){
            signOut.signOut($this);
        }
        
    });
    }

    onChangePagi(event){
        $this.setState({perPages  : event.target.value},function(){
            $this.fetchData();});
      }
   
  render(){
    const edit = this.state.edit;
    let label;
    let button;
    let branch= [];
    let branchStatus= ['branch1','branch2'];
    for(let roomKey=0 ; roomKey<branchStatus.length; roomKey++){
        branch.push(<div key={roomKey} className="radio col-lg-4">
                              <label key="roomKey"> 
                              <input type="radio" name="branchStatus" key={roomKey} value={roomKey} onChange={$this.handleOnChange} checked={this.state.branchStatus == roomKey}/>
                                {branchStatus[roomKey]}
                              </label>
                              </div>); 
    }

    if (edit == true) {
        label = <label ref={subtitle => this.subtitle = subtitle} htmlFor="cp3" id="label"><h3>Edit employee</h3></label>
        button = <button className="btn btn-primary">Edit employee</button>
    } else {
        label = <label ref={subtitle => this.subtitle = subtitle} htmlFor="cp3" id="label"><h3>Create employee</h3></label>
        button = <button className="btn btn-primary">Add employee</button>
    }
    return(
      <div className="col-lg-12">
        <div className="box">
            <div className="col-lg-10">
                <h1 className="text-primary">Employee</h1>
            </div>
            <div className="col-lg-1">
                <button className="btn btn-primary top" style={{ marginTop:'20px'}} onClick={() => this.openModal()}>Add New employee</button>        
            </div>    

            <div id="collapse4" className="body">
                <div className="row">
                    <div className="col-lg-10">
                        <div id ="dataTable_length" className="dataTables_length">
                            <input type="text" className="form-control form-control-lg" placeholder="Search" style={{float:'left',width:'35%'}} onChange={this.filterList}/>
                            <button onClick={() => this.fetchData()} style={{ marginLeft: '20px'}} className="btn btn-primary">Search</button>
                        </div>
                    </div>
                </div> 
                <br/> 
                <div className="row">
                    <div className="col-sm-12">
                        <table id="dataTable" className="table table-bordered table-condensed table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Employee ID</th>
                                    <th>Phone No</th>
                                    <th>Employee Type</th>
                                    <th>Salary</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.tabRow()}
                            </tbody>                
                        </table>
                    </div>
                </div>
                <div id="dataTable_paginate" className="dataTables_paginate paging_simple_numbers" >
                    <Pagination
                        paginate = {this.state.pagination}
                        onPageChange={this.fetchData}
                        onChangePagi={this.onChangePagi}
                    />
                </div>
            </div>  
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        > 
        <div id="collapseOne" className="body">
        
            <div className="col-lg-11">
                {label}
            </div>       
            <div className="col-lg-1">
                <button onClick={this.closeModal} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form onSubmit={this.createSubmit} className="form-horizontal" id="block-validate">
                <div className={(this.state.formErrors.name=='The name field is required.')? "form-group has-error": "form-group"} value={this.state.formErrors.name}>
                    <label htmlFor="cp3" className="control-label col-lg-4">Name:</label>
                    <div className="col-lg-4">
                        <input type="text" className="form-control" id="name" name="name" autoFocus="true" onChange={$this.handleOnChange} value={this.state.name}/>
                        <span className="help-block"> {this.state.formErrors.name} </span>
                    </div>
                </div>
               
                <div className={(this.state.formErrors.phone_no=="The Phone No field is required.")? "form-group has-error": "form-group"}>
                    <label htmlFor="cp3" className="control-label col-lg-4">Phone No:</label>
                    <div className="col-lg-4">
                        <input type="text" className="form-control" id="phoneNo" name="phoneNo" onChange={$this.handleOnChange} value={this.state.phoneNo}/>
                        <span className="help-block"> {this.state.formErrors.phoneNo} </span>
                    </div>
                </div>
                <div className={(this.state.formErrors.roomtype=="The Employee Type field is required.")? "form-group has-error": "form-group"}>
                    <label htmlFor="cp3" className="control-label col-lg-4">Employee Type:</label>
                    <div className="col-lg-4">
                        <select className="form-control" id="empTypeId" name="empTypeId" onChange={$this.handleOnChange} value={this.state.empTypeId}>
                          <option value="">Choose</option>
                            {this.option()}
                        </select>
                        <span className="help-block"> {this.state.formErrors.empTypeId} </span>
                    </div>
                </div>
                
                <div className={(this.state.formErrors.roomtype=="The Employee Type field is required.")? "form-group has-error": "form-group"}>
                    <label htmlFor="cp3" className="control-label col-lg-4">Branch:</label>
                     {branch}
                </div>

                <div className={(this.state.formErrors.phone_no=="The salary field is required.")? "form-group has-error": "form-group"}>
                    <label htmlFor="cp3" className="control-label col-lg-4">Salary:</label>
                    <div className="col-lg-4">
                        <input type="text" className="form-control" id="salary" name="salary" onChange={$this.handleOnChange} value={this.state.salary}/>
                        <span className="help-block"> {this.state.formErrors.salary} </span>
                    </div>
                </div>
                <div className="form-actions no-margin-bottom">
                    {button}
                </div>
            </form>
        </div>
        </Modal>        
      </div>       
    );
  }
}
class TableRow extends Component{
    constructor(props) {
        super(props);
        this.DeleteSubmit = this.DeleteSubmit.bind(this);
    }
    DeleteSubmit(e){
        e.preventDefault();
        const msg = confirm('Are you sure want to delete?');
        if(msg == true){
            let uri = config.baseurl+'employee/'+this.props.obj.id;
            axios.delete(uri).then((response) => {
            if(response.data.result==false){
                $this.setState({ formErrors: response.data.errors });
                return false;
            }else{
                $this.fetchData();
            }
            }).catch(function (error) {
                if(error.response.status == 401){
                    signOut.signOut($this);
                }
            });
        }
    }
  render(){
      let btndelete;

      if(this.props.obj.booking_id){
        btndelete = <input type="submit" value="Delete" disabled="true" className="btn btn-danger"/>
      }else{
        btndelete = <input type="submit" value="Delete" className="btn btn-danger"/>
      }
      return (
          <tr>
              <td>
                  {this.props.obj.id}
              </td>
              <td>
                  {this.props.obj.name}
              </td>
              <td>
                  {this.props.obj.emp_code}
              </td>
              <td>
                  {this.props.obj.phone_no}
              </td>
              <td>
                  {this.props.obj.emp_type_name}
              </td>
              <td>
                  {this.props.obj.salary}
              </td>
              <td>
                  <button onClick={() => this.props.editData(this.props.obj)} className="btn btn-primary">Edit</button>
              </td>
              <td>
                <form onSubmit={this.DeleteSubmit}>
                    {btndelete}
                </form>
              </td>
          </tr>
      )
  }
}
export default Employee;