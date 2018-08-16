import React, { Component } from 'react';
// import LineChart from 'react-linechart';
 import config from '../config';
 import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
import SignOut from "./SignOut";
import XLSX from 'xlsx' 

var signOut;
var $this;
class Dashboard extends Component {
        constructor() {
          super()
          $this = this;
          this.state = {employeeData:[],
                        salaryData: []};
          this.fetchData = this.fetchData.bind(this);
          signOut = new SignOut();
        }

        componentDidMount() {
            this.fetchData();
        }
        export(){
            axios.get(config.baseurl+"dashboard")
            .then(response => {
                let empSalary = response.data.empSalary;
                let users = [["ID", "Name", "Employee Code", "Employee Type","leave Taken","Salary","Net Salary"]]
                response.data.employees.forEach((employee) => {
                let salary = empSalary[employee.emp_code];
                let userArray = [employee.id, employee.name, employee.emp_code, employee.emp_type_name,salary.taken_leave,employee.salary,salary.net_salary]
                users.push(userArray)
                })
                const wb = XLSX.utils.book_new()
                const wsAll = XLSX.utils.aoa_to_sheet(users)
                    XLSX.utils.book_append_sheet(wb, wsAll, "All Users")
                    XLSX.writeFile(wb, "attendance.xlsx")
                
            })
            .catch(function (error) {
                
                
            })
            
    
          }
        fetchData(){
            axios.get(config.baseurl+"dashboard")
            .then(response => {
                
                this.setState({ employeeData: response.data.employees,
                                salaryData: response.data.empSalary});
               
            })
            .catch(function (error) {
                if(error.response.status == 401){
                    signOut.signOut($this);
                }
                
            })
          }
          tabRow(){
            if($this.state.employeeData instanceof Array){
              return $this.state.employeeData.map(function(object, i){
                 
                  return <TableRow obj={object} empSalary={$this.state.salaryData[object.emp_code]} key={i}/>;
               
                })
            }
          }
   render() {
    
        return (

            <div className="col-lg-12">
                <div className="box">
                    <div className="col-lg-9">
                        <h3 className="text-primary">Dashboard</h3>
                    </div>
                    <div className="col-lg-1">
                                        <div id ="dataTable_filter" className="dataTables_filter">
                                            <button onClick={() => this.export()} id="presBtn" className="btn btn-primary">Export</button>
                                        </div>
                            </div>
                    <div className="row">
                    <div className="col-sm-12">
                        <table id="dataTable" className="table table-bordered table-condensed table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Employee ID</th>
                                    <th>Employee Type</th>
                                    <th>Leave Taken</th>
                                    <th>Salary</th>
                                    <th>Net Salary</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {this.tabRow()}
                            </tbody>                
                        </table>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
class TableRow extends Component{
    constructor(props) {
        super(props);
    }
    
  render(){
      console.log(this.props);
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
                  {this.props.obj.emp_type_name}
              </td>
              <td>
                  {this.props.empSalary.taken_leave}
              </td>
              <td>
                  {this.props.obj.salary}
              </td>
              <td>
                  {this.props.empSalary.net_salary}
              </td>
              
          </tr>
      )
  }
}
export default Dashboard;