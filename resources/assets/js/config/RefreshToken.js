import React, { Component } from 'react';
import config from './index';
import {browserHistory} from 'react-router';
class RefreshToken extends Component {
    constructor(props) {
        super(props); 
    }

    async callRefreshToken(){  
        let response;      
        try{
             response = await axios.get(config.baseurl+"refresh");    
        }catch(error) {
            browserHistory.push('/signin');
        }
        axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
        localStorage.setItem('token', response.data.token);    
    }
   
}
export default RefreshToken;