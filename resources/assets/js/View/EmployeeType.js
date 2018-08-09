import React, { Component } from 'react';
import Modal from 'react-modal';
import config from '../config';
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
   
  // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');
class EmployeeType extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {  perPages:''
                        ,searchName: ''
                        ,emptypes: ''
                        ,name: ''
                        ,leaveDay: ''
                        ,id: ''
                        ,mode: ''
                        ,pagination: ''
                        ,modalIsOpen: false
                        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        signOut = new SignOut();
      }
      componentWillMount() {
        this.setState({
            emptypes: {},
            pagination: {},
            formErrors: { 'name': '' ,'leave_day': ''},
            perPages:5
        })
      }
      componentDidMount(){
        $this.fetchData();
      }

      //to open modal
      openModal() {
        this.setState({modalIsOpen: true});
      }
      afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = 'rgb(38, 101, 132)';
      }
      //to close Modal
      closeModal() {
       
        this.setState({modalIsOpen: false, mode:'', name: '', id: '', formErrors: { 'name': '','leaveDay': ''}});
      }
      //to display table row
      tabRow(openModal){
        // {this.state.pageOfItems.map(item =>
        //     <div key={item.id}>{item.name}</div>
        // )}
        if($this.state.emptypes instanceof Array){
          return $this.state.emptypes.map(function(object, i){
              return <SingleRow obj={object} key={i} openModal={openModal}/>;
          })
        }
      }
      handleOnChange(e){
        $this.setState({
          [e.target.name]: e.target.value
        })
      }
      
      createSubmit(event) {
          
        event.preventDefault();
        const emptypes = {
          name: $this.state.name,
          leaveDay: $this.state.leaveDay,
          id: $this.state.id
        }
        // alert(emptypes);
        let uri = config.baseurl+'emptypes';
        
        axios.post(uri, emptypes).then((response) => {
           
            if(response.data.result==false){
                $this.setState({ formErrors: response.data.errors });
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
      filterList(event){
        $this.setState({searchName  : event.target.value.toLowerCase()});
      }
      onChangePagi(event){
        $this.setState({perPages  : event.target.value},function(){
            $this.fetchData();});
      }
      fetchData(page =1){
       
        axios.get(config.baseurl+"emptypes?page="+page+"&name="+$this.state.searchName+"&perPages="+$this.state.perPages)
        .then(response => {
           
            $this.setState({ emptypes: response.data.emptypes.data });
            
            $this.setState({ pagination: response.data.pagination });
        
        })
        .catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        })
      }
      edit(id){
        // alert(id);
        this.openModal();
        axios.get(config.baseurl + "emptypes/" + id + "/edit").then(response => {
            // console.log(response.data);
            $this.setState({
                name: response.data.name,
                leaveDay: response.data.leave_day,
                mode:'edit',
                id: response.data.id
            });
        }).catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        });
      }
      delete(id){
       var msg=confirm("Are you sure to delete");
       if(msg==true){
          axios.delete(config.baseurl + "emptypes/" + id).then(response => {
              this.fetchData();
          }).catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        });
      }
    }
   render() {
       let create;
       let add_button;
    //    alert(this.state.mode);
       if(this.state.mode=="edit"){
        //    alert('ok');
        create = "Edit Employee Type";
        add_button = "Edit Employee Type";
       }else{
           create = "Create Employee Type";
           add_button = "Add Employee Type";
       }

        return (
            <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-9">
                        <h1 className = "text-primary"> Employee Type</h1>
                    </div>
                    <div className="col-lg-1">
                        <button className="btn btn-primary" onClick={() => this.openModal()} style={{marginTop:'20px',marginLeft:'56px'}}>Add New  Employee Type</button>        
                    </div>    

                    <div id="collapse4" className="body">
                        <div className="row">
                            <div className="col-lg-4">
                                
                                <div id ="dataTable_length" className="dataTables_length">
                                    <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
                                </div>
                            </div>
                            <div className="col-lg-1">
                                <div id ="dataTable_filter" className="dataTables_filter">
                                    <button onClick={() => this.fetchData()} style={{marginTop:'0px'}} className="btn btn-primary">Search</button>
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
                                            <th>Total Leave Days</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tabRow(this.openModal)}
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
                        
                        <label ref={subtitle => this.subtitle = subtitle} htmlFor="cp3"><h3>{create}</h3></label>
                    </div>       
                    <div className="col-lg-1">
                        <button onClick={this.closeModal} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <form onSubmit={this.createSubmit} className="form-horizontal" id="block-validate">
                        <div className={(this.state.formErrors.name=="")? "form-group": "form-group has-error"}>
                            <label htmlFor="cp3" className="control-label col-lg-4">Name:</label>
                            
                            <div className="col-lg-4">
                            
                                <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={$this.handleOnChange} />
                                <span className="help-block"> {this.state.formErrors.name} </span>
                            </div>
                            
                        </div>
                        <div className={(this.state.formErrors.leaveDay=="")? "form-group": "form-group has-error"}>
                        <label htmlFor="cp3" className="control-label col-lg-4">Leave Days:</label>
                            <div className="col-lg-4">
                            
                                <input type="text" className="form-control" id="leaveDay" name="leaveDay" value={this.state.leaveDay} onChange={$this.handleOnChange} />
                                <span className="help-block"> {this.state.formErrors.leaveDay} </span>
                            </div>
                        </div>
                        <div className="form-actions no-margin-bottom">
                            <button className="btn btn-primary">{add_button}</button>
                        </div>
                    </form>
                </div>
                </Modal>
            </div>
        );
    }
}
class SingleRow extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <tr>
                <td>
                    {this.props.obj.id}
                </td>
                <td>
                    {this.props.obj.name}
                </td>
                <td>
                    {this.props.obj.leave_day}
                </td>
                <td>
                    {/* <Link to={"edit/"+this.props.obj.id} className="btn btn-primary">Edit</Link> */}

                    <button onClick={() => $this.edit(this.props.obj.id)} className="btn btn-primary">Edit</button>
                </td>
                <td>                
                  <button onClick={() => $this.delete(this.props.obj.id)}  className="btn btn-danger" disabled={this.props.obj.roomtype_id}>Delete</button>
                </td>
            </tr>
        )
    }
}
export default EmployeeType;