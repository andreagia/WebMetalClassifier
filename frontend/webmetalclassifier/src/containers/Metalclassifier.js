import React, { Component } from "react";
import Readfile from '../components/Readfile'
import {Box,Grid,AppBar,Toolbar,Typography} from  '@mui/material'
import Pdbmanageclass from "../components/Pdbmanageclass";

import Pdbmanage from "../components/Pdbmanage";

class Metalclassifier extends Component {
    state = {
        filepdb: []
    };

    checkpdbinput = (pdb) => {
        let filter1 = pdb.filter(a => a.match(/^(ATOM|HETATM)/) || a.match(/^END/) || a.match(/^TER/));
        console.log(filter1);
        this.setState({filepdb: [...filter1]})
    }

    render() {
        return (
            <div style={{padding: 16, margin: 'auto', maxWidth: 1024}}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container spacing={2}>
                        <AppBar position="static" spacing={2}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                    Metal Binding Classifier
                                </Typography>

                            </Toolbar>
                        </AppBar>
                        <Grid item xs={3}>
                        <Readfile addfile={(txt) => this.checkpdbinput(txt)}>File pdb</Readfile>
                        </Grid>
                        <Grid item xs={12}>
                            {/*<Pdbmanage key={Math.random().toString(36).substr(2)} pdbfile={this.state.filepdb}  />*/}
                        </Grid>
                    </Grid>
                </Box>
                <Pdbmanage pdb={this.state.filepdb}></Pdbmanage>
            </div>
        );
    }
}

export default Metalclassifier;