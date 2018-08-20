import React, { Component } from 'react';
import Modal from 'react-modal';
import config from '../config';
import Pagination from "../components/pagination";
import SignOut from "./SignOut";
import RefreshToken from '../config/RefreshToken';

var $this;
var signOut;
var refreshToken;
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
  let months = ["Jan","Feb","Mar","Apr"
                        ,"May","Jun","Jul","Aug"
                        ,"Sep","Oct","Nov","Dec"]
   
  // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');
class Attendance extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {  perPages:''
                        , searchYear: ''
                        , searchMonth: ''
                        , attendances: ''
                        , dates: ''
                        , employees: ''
                        , pagination: ''
                        , name: ''
                        , empId: ''
                        , selectEmpID: []
                        , id: ''
                        , attendanceDate: ''
                        , attendanceStatus: ''
                        , attStatusForUpdate : ''
                        , editButton: ''
                        , noOfBookings:''
                        , isChecked : false
                        , modalIsOpen: false};
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        signOut = new SignOut();
      }
      componentWillMount() {
        this.setState({
            attendances: {}
            ,dates: {}
            ,employees: {}
            ,attendanceStatus:0
            ,searchYear: new Date().getFullYear()
            ,searchMonth: new Date().getMonth() +1
            ,pagination: {}
            ,formErrors: {}
            ,isChecked : false
        })
        this.selectedCheckboxes = new Set();
      }
      async componentDidMount(){
        document.getElementById("Loading").style.display = "none";
        const refreshToken = new RefreshToken();
        await refreshToken.callRefreshToken();
        $this.fetchData();
      }
    //   componentDidMount(){
    //     document.getElementById("Loading").style.display = "none";
    //     $this.fetchData();
    //     refreshToken = new RefreshToken();
    //   }
      toggleCheckboxChange (id) {
        //const { handleCheckboxChange, label } = this.props;
    
        this.setState(({ isChecked }) => (
          {
            isChecked: !isChecked,
          }
        ));
        if (this.selectedCheckboxes.has(id)) {
            this.selectedCheckboxes.delete(id);
          } else {
            this.selectedCheckboxes.add(id);
          }
          console.log(this.selectedCheckboxes);
          for (const checkbox of this.selectedCheckboxes) {
            console.log(checkbox, 'is selected.');
          }
       // handleCheckboxChange(label);
      }
      //to open modal
      openModal() {
        this.setState({modalIsOpen: true});
      }
      afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
      }
      //to close Modal
      closeModal() {
       
        this.setState({modalIsOpen: false
                        ,formErrors: {}
                        , name: ''
                        , empId: ''
                        , id: ''
                        , attendanceDate: ''
                        , attendanceStatus:0
                        , editButton: ''
                        , noOfBookings: ''});
        }
      getfullDay(t){
        var date=new Date(this.state.searchYear+'/'+this.state.searchMonth+'/'+t);
        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";
        var day = weekday[date.getDay()];
        return day;
     }
      tableTh(){
        let tableTr = []
        if($this.state.dates instanceof Array){
            $this.state.dates.map(function(date, key){
                tableTr.push(<th key={key}>{date}<br/>
                <span>{$this.getfullDay(date)}</span>
                </th>)
           })
        }
        return tableTr
      }
      
      openRegisterModal(empId,date,checkCreate=""){
        var attendanceDate= $this.state.searchYear+'_'+$this.state.searchMonth+'_'+date;
        //register booking
        if(checkCreate == ""){
            this.setState({modalIsOpen: true,empId:empId,attendanceDate:attendanceDate});
        }else{
            //new booking when booking status is check out
            this.setState({editButton: '',id:'',name:'',attendanceStatus:'0',price:'',empId:empId,attendanceDate:date});
        }
      }
      openUpdateModal(id,attStatusForUpdate){
          
        this.setState({modalIsOpen: true
            ,id:id
            ,attStatusForUpdate :attStatusForUpdate });
        
      }
      //to display table row
      tabRow(openModal){
        
        let table = []
        var attendances = $this.state.attendances; 
        var roomStatusData ={0:"Full",1:"Half"};
        if($this.state.employees instanceof Array){
             $this.state.employees.map(function(employee, empKey){
                
                 let childTr = []
                
                 childTr.push(<td key={'name'+empKey}> {employee.name}</td>);
                 childTr.push(<td key={'emptype'+empKey}><i className={employee.emptype_name == "manager"? "fa fa-user-circle-o" : "fa fa-user"}></i><input type="checkbox" id="selectEmpID" className="selectEmpID"  name="selectEmpID" value={employee.id} onChange={() => $this.toggleCheckboxChange(employee.id)}/></td>);
                if($this.state.dates instanceof Array){
                 $this.state.dates.map(function(date, key){
                     var idDate = date+"_"+employee.id;
                     if(attendances.hasOwnProperty(idDate)){
                       
                        var attendance = attendances[idDate];
                        
                        if(attendance.attendance_status == "0"){
                            childTr.push(<td className="pointer" id={date} onClick={() => $this.openUpdateModal(attendance.id,0)} key={'btn'+key}>
                                    {roomStatusData[attendance.attendance_status]}
                                    
                                    </td>);
                        }else if(attendance.attendance_status == "1"){
                            childTr.push(<td className="pointer success" id={date} onClick={() => $this.openUpdateModal(attendance.id,1)} key={'btn'+key}>
                                    {roomStatusData[attendance.attendance_status]}
                                    
                                    </td>);
                        }
                        

                     }else{
                         
                        childTr.push(<td className="danger pointer" onClick={() => $this.openRegisterModal(employee.id,date)}>L
                        </td>);
                         
                     }
                   
                })
                }
                table.push(<tr key={'tr'+empKey}>{childTr}</tr>)
            })
        }
        return table
      }
      
      handleOnChange(e){
        $this.setState({
          [e.target.name]: e.target.value
        })
      }

      createSubmit(event) {
        event.preventDefault();
        
        const roomtypes = {
          attendanceStatus :$this.state.attStatusForUpdate
          ,id:$this.state.id
          ,user_id : localStorage.getItem('loginUserId')
        }
        
        let uri = config.baseurl+'attendances';
        axios.post(uri, roomtypes).then((response) => {
            
            if(response.data.result==false){
                $this.setState({ formErrors: response.data.errors });
                return false;
            }else{
                
                $this.closeModal();
                $this.fetchData();
               
            }    
        })
        .catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        });
      }
      filter(event){
        //console.log(event.target);
        $this.setState({[event.target.name]  : event.target.value},function(){
            $this.fetchData();});
      }
      onChangePagi(event){
        $this.setState({perPages  : event.target.value},function(){
        $this.fetchData();});
      }
      fetchData(page =1){
        axios.get(config.baseurl+"attendances?page="+page+"&year="+$this.state.searchYear+"&month="+$this.state.searchMonth+"&perPages="+$this.state.perPages)
        .then(response => {
           $this.setState ({isChecked: false});
            $this.setState({ dates: response.data.dates });
            $this.setState({ employees: response.data.employees.data });
            $this.setState({ attendances: response.data.attendances });
            $this.setState({ pagination: response.data.pagination });
            $this.setState({ dates: response.data.dates });
        
        })
        .catch(function (error) {
            if(error.response.status == 401){
                signOut.signOut($this);
            }
            
        })
      }
      setPresent(){
        console.log('set present');
        console.log(this.selectedCheckboxes);
        let selectedIDs = [...this.selectedCheckboxes];
       
        const attendance = {
            year: $this.state.searchYear
            ,month: $this.state.searchMonth
            ,user_id : localStorage.getItem('loginUserId')
            ,selected_id : selectedIDs
          }
          document.getElementById("Loading").style.display = "block";
          document.getElementById("presBtn").disabled = true;
          let uri = config.baseurl+'setAttendance';
           axios.post(uri, attendance).then((response) => {
            document.getElementById("presBtn").disabled = false;
            //document.getElementById("selectEmpID").checked = false;
            $('.selectEmpID').prop('checked',false);
            document.getElementById("Loading").style.display = "none";
            this.selectedCheckboxes = new Set();
            $this.fetchData();
        
        })
        .catch(function (error) {
            
            
        })

      }
      yearOption() {
        let startYear = parseInt(this.state.searchYear) - 5;
        let endYear = parseInt(this.state.searchYear) + 5;
        let yearOption = []
        for (let i = startYear; i <= endYear; i++) {
            yearOption.push(<option key={i} value={i}>{i}</option>)
        }
        return (
            yearOption
        );
      }
      monthOption() {
        
        let monthOption = []
        months.map(function(month, key){
            monthOption.push(<option key={key} value={key+1}>{month}</option>)
        });
        return (
            monthOption
        );
      }
      
      backClick(event){
            event.preventDefault();
            $this.setState({editButton: ''});
      }
      
   render() {
       var formerrors = this.state.formErrors;
       
        return (
            <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-10">
                        <h3 className="text-primary">Attendance</h3>
                    </div>
                    <div className="col-lg-1">
                        {/* <button className="btn btn-primary" onClick={() => this.openEditModal()}>Add New  employee Type</button>         */}
                    </div>    

                    <div id="collapse4" className="body">
                        <div className="row">
                            <div className="col-lg-4 search-bar">
                                <div id ="dataTable_length" className="dataTables_length">
                                    {/* <input type="text" className="form-control form-control-lg" id="date-picker" value={this.state.searchYear} placeholder="Year" onChange={this.filterYear}/> */}
                                    <select className="form-control selected_month" name="searchYear" value={this.state.searchYear} onChange={this.filter}>
                                        {this.yearOption()}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4 search-bar">
                                <div id ="dataTable_length" className="dataTables_length">
                                    <select className="form-control selected_month" name="searchMonth" value={this.state.searchMonth} onChange={this.filter}>
                                        {this.monthOption()}
                                    </select>

                                </div>
                            </div>
                            <div className="col-lg-1">
                                        <div id ="dataTable_filter" className="dataTables_filter">
                                            <button onClick={() => this.setPresent()} id="presBtn" className="btn btn-primary">Set Present</button>
                                        </div>
                            </div>
                            {/* <div className="col-lg-1">
                                <div id ="dataTable_filter" className="dataTables_filter">
                                    <button onClick={() => this.fetchData()} className="btn btn-primary">Search</button>
                                </div>
                            </div> */}
                        </div>  
                        <div className="row">
                            <div className="col-sm-12">
                                <div id="Loading">
                                    <center><h3><li className="fa fa-spinner">Loading ....</li></h3></center>
                                </div>
                                <div className=" table-responsive">
                                    <table id="dataTable" className="table table-bordered table-condensed table-hover table-striped">
                                        <thead>
                                            <tr>
                                            <th colSpan="2">{$this.state.searchYear != ''?$this.state.searchYear: new Date().getFullYear()}-<br/><span>{$this.state.searchMonth != ''? months[$this.state.searchMonth-1] : months[new Date().getMonth()]} </span></th>
                                                {this.tableTh()}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tabRow(this.openModal)}
                                        </tbody>                
                                    </table>
                                    
                                </div>
                                
                            </div>
                        </div>
                        
                        <Pagination
                            paginate = {this.state.pagination}
                            onPageChange={this.fetchData}
                            onChangePagi={this.onChangePagi}
                        />  
                       <div className="col-sm-12">
                        <label>L : Leave</label><br/>
                        <label>Full : No Leave</label><br/>
                        <label>Half : Half Day Leave</label>
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
                    
                    <div className="col-lg-10">
                        <label ref={subtitle => this.subtitle = subtitle} ><h3 className="text-primary">Attendance</h3></label>
                    </div>       
                    <div className="col-lg-2">
                        <button onClick={this.closeModal} className="close" aria-label="Close"><span aria-hidden="true"><h2>&times;</h2></span></button>
                    </div>
                    
                        
                        <ModalForm
                            params={this.state}
                            handleOnChange = {this.handleOnChange}
                            createSubmit ={this.createSubmit}
                            openRegisterModal ={this.openRegisterModal}
                            backClick = {this.backClick}
                           />
                        
                </div>
                </Modal>
            </div>
        );
    }
}
class ModalForm extends Component{
    constructor(props) {
        super(props);
    }
    
    render(){
        
        var buttonDisplay = [];
        var nameInput = [];
        var roomStatusInput = [];
        var attendanceStatus = ["Full","Half", "Leave"];
        
        for(let empKey=0 ; empKey<attendanceStatus.length; empKey++){
                roomStatusInput.push(<div key={empKey} className="radio">
                                      <label key="empKey"> 
                                      <input type="radio" 
                                      name="attStatusForUpdate" 
                                      key={empKey} 
                                      value={empKey} 
                                      onChange={this.props.handleOnChange} 
                                      checked={this.props.params.attStatusForUpdate == empKey}/>
                                        {attendanceStatus[empKey]}
                                      </label>
                                      </div>); 
            }

        return (
            <form onSubmit={this.props.createSubmit} className="form-horizontal" id="block-validate">
            
            <div className={(this.props.params.formErrors.hasOwnProperty('attendance_status'))? "form-group has-error": "form-group"}>
                <label className="control-label col-lg-4">attendanceStatus:</label>
                <input type="hidden" name="id" className="form-control" value={this.props.params.id}/>
                <div className="col-lg-4">
                   
                    {roomStatusInput}
                </div>
            
            </div>
        
            <div key="div-book" className="form-actions">
                <button key="btn-book" className="btn btn-primary center-block">Edit</button>
            </div>
            </form>     
        )
    }
}
export default Attendance;
