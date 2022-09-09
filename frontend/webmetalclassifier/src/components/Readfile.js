import React, { Component } from 'react';
//import axios from 'axios';
//view this example
//https://www.youtube.com/watch?v=sp9r6hSWH_o
class Readfile extends Component {

    onchange = (e) => {
        let files = e.target.files;
        let reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload=(e)=>{
            const retfile = {};
            retfile.name = files[0].name;
            retfile.content = e.target.result.split("\n");
            console.log(retfile.content);
 //           console.log(files);

            this.props.addfile(retfile.content)


        }
    };
         render() {
             return(
             <div>
                 <label htmlFor="avatar">{this.props.children}</label>
                 <input type="file" name="file" onChange={(e) => this.onchange(e)} />
             </div>)
         }
}

export default Readfile;