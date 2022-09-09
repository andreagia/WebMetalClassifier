import React, {Component} from 'react';
import {Box,Grid,Select,MenuItem,Toolbar,Typography} from  '@mui/material'
import * as NGL from 'ngl';
import checkpdb from "../utils/checkpdb";
//import Printchains from "./Printchainsui";
//import ParamTbale from "./ParamTable";
import calcdistance from "../utils/calcDistance";
import findMetal from "../utils/findMetal";
import residueMean from "../utils/residueMean";
import calcDistanceFromPoint from "../utils/calcDistanceFromPoint";
import findMin from "../utils/findMin";
import findNearRes from "../utils/findZones";
//import JSZip from "jszip"
//import { saveAs } from 'file-saver';
import axios from "axios";
//import * as math from "mathjs/es/entry/impureFunctionsAny.generated";
import './Nglview.css';
import makepdbjson from "../utils/makepdbjson";

class Pdbmanageclass extends Component {
    stage = null;
    ligrep1 = null;
    ligrep2 = null;
    ligrep3 = null;
    ligrep4 = null;
    ligrepzn = null;
    ligrepover = null;
    pdbjson = {};
    state = {
        resoverngl: "none",
        ligrep1: "none",
        ligrep2: "none",
        ligrep3: "none",
        ligrep4: "none",
        ligrepzn: "none",
        ligrep1_table: "none",
        ligrep2_table: "none",
        ligrep3_table: "none",
        ligrep4_table: "none",
        ligrepzn_table: "none",
        store1: false,
        store2: false,
        store3: false,
        store4: false,
        storezn: false,
        pdbfile: [],
        cma: [],
        selsetmetal: "none",
        mes: []
    };

    shouldComponentUpdate(nextProps, nextState) {
        console.log("NGLVIEW shoulddcomponentupdate 1--------------------------------");
        return true;
        //return this.props.pdbfile !== nextProps.pdbfile
    }

    setMetal = (event) => {
        let cma = event.target.value;
        console.log(event.target.value, event.target.name);
        let rsmean = residueMean(this.props.pdbfile);
        //let rsmeanvect = Object.keys(rsmeam).reduce((v, a) => {v.push({[a]:Object.values(a)})}, []);
        //let rsmeanvobj= Object.keys(rsmeam).reduce((v, a) => (v[[a]]=Object.values(a)),{});
        console.log(rsmean, cma, rsmean[cma]);
        let nslist = findNearRes(this.props.pdbfile, [rsmean[cma]]);
        console.log(cma, nslist);

        this.setState({
            ligrepzn_table: Object.keys(nslist[0])[0],
            ligrepzn: Object.keys(nslist[0])[0].split(/\s/)[1],
            ligrep1_table: Object.keys(nslist[1])[0],
            ligrep1: Object.keys(nslist[1])[0].split(/\s/)[1],
            ligrep2_table: Object.keys(nslist[2])[0],
            ligrep2: Object.keys(nslist[2])[0].split(/\s/)[1],
            ligrep3_table: Object.keys(nslist[3])[0],
            ligrep3: Object.keys(nslist[3])[0].split(/\s/)[1],
            ligrep4_table: Object.keys(nslist[4])[0],
            ligrep4: Object.keys(nslist[4])[0].split(/\s/)[1],
        });
        console.log(this.state);
        this.ligrepzn.setVisibility(true);
        this.ligrepzn.setSelection(Object.keys(nslist[0])[0].split(/\s/)[1]);
        this.ligrep1.setVisibility(true);
        this.ligrep1.setSelection(Object.keys(nslist[1])[0].split(/\s/)[1]);
        this.ligrep2.setVisibility(true);
        this.ligrep2.setSelection(Object.keys(nslist[2])[0].split(/\s/)[1]);
        this.ligrep3.setVisibility(true);
        this.ligrep3.setSelection(Object.keys(nslist[3])[0].split(/\s/)[1]);
        this.ligrep4.setVisibility(true);
        this.ligrep4.setSelection(Object.keys(nslist[4])[0].split(/\s/)[1]);
    };

    componentDidMount() {
        console.log("NGLVIEW didmount 1");

        const viewover = (over) => {
            console.log(over);
            this.setState({resoverngl: over});
        };

        if (!this.stage) {
            this.stage = new NGL.Stage("viewport");
            this.stage.signals.hovered.add(function (pickingProxy) {
                if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
                    console.log(pickingProxy);
                    console.log(pickingProxy.atom !== undefined ? pickingProxy.atom.resno : "none");
                    viewover(pickingProxy.atom !== undefined ? pickingProxy.atom.resno : "none");
                }
            })
        }

        if (this.props.pdbfile.length > 0) {
            console.log("NGLVIEW didmount 2");
            // this.setState({pdbfile: [...this.props.pdbfile]});
            // let pdblist = [...this.props.pdbfile];
            // let matrix = calcdistance(pdblist);

            let matrix = calcdistance(this.props.pdbfile);
            //let cma = findMetal(this.props.pdbfile);
            //let rsmeam = residueMean(this.props.pdbfile);
            console.log("----------------MAKEFASTA--------------------");
            makepdbjson(this.props.pdbfile, this.pdbjson);
            //findMetal(this.props.pdbfile)
            //let rsmeanvect = Object.keys(rsmeam).reduce((v, a) => {v.push({[a]:Object.values(a)})}, []);
            //let rsmeanvobj = Object.keys(rsmeam).reduce((v, a) => (v[[a]] = Object.values(a)), {});
            //console.log(cma, rsmeam, rsmeanvobj);
            //this.setState({cma: [...cma]});
            this.setState({mes: [...Object.keys(this.pdbjson["mes"])]});
            //console.log(this.state);
            console.log(Object.keys(this.pdbjson["mes"]));
            //let dist = calcDistanceFromPoint(rsmeam, [1, 1, 1]);
            //let slist = findMin(dist);
            //console.log(cma);
            //console.log([rsmeam[Object.keys(cma[0])[0]]]);
            //let nslist = findNearRes(this.props.pdbfile, [rsmeam[Object.keys(cma[0])[0]]]);

            //console.log(rsmeam);
            //console.log(cma);
            //console.log(dist);
            //console.log(slist);
            //console.log(nslist);
            const matchpdb = (item) => {
                return ((/^ATOM/.test(item) || /^HETATM/.test(item) || /^TER/.test(item) || /^END/.test(item)) && !/HOH/.test(item))
            };
            let dataArray = this.props.pdbfile.filter(item => matchpdb(item));
            let retpdb = dataArray.join("\n");
            console.log("------- RET PDB ---------");
            console.log(retpdb);
            let blob = new Blob([retpdb], {type: 'text/html'});

            const waitLoadNGL = async (o) => {
                await o.loadFile(blob, {name: "myProtein", ext: "pdb"});
                let dd = o.getComponentsByName("myProtein");
                console.log(dd, o);
                console.log(dd.list[0].structure);
                dd.list[0].addRepresentation("cartoon", {colorScheme: "atomindex"});
                dd.list[0].structure.eachResidue(function (rp) {
                    //  console.log(rp);
                    //  console.log(o);
                    // }, new NGL.Selection("polymer and :A"));
                }, new NGL.Selection("polymer"));
                dd.autoView();
                console.log(dd);
                console.log(dd.structure);
                let ballstick = {
                    multipleBond: "symmetric",
                    colorValue: "gray",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 5.0
                };
                let ballstickred = {
                    multipleBond: "symmetric",
                    colorValue: "red",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 2.5
                };
                let ballstickblue = {
                    multipleBond: "symmetric",
                    colorValue: "blue",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 2.5
                };
                let ballstickyellow = {
                    multipleBond: "symmetric",
                    colorValue: "yellow",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 2.5
                };
                let ballstickgreen = {
                    multipleBond: "symmetric",
                    colorValue: "green",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 2.5
                };
                let ballstickorange = {
                    multipleBond: "symmetric",
                    colorValue: "orange",
                    sele: "none",
                    aspectRatio: 1.2,
                    radiusScale: 2.5
                };
                this.ligrep1 = dd.list[0].addRepresentation("ball+stick", ballstickred);
                this.ligrep2 = dd.list[0].addRepresentation("ball+stick", ballstickblue);
                this.ligrep3 = dd.list[0].addRepresentation("ball+stick", ballstickyellow);
                this.ligrep4 = dd.list[0].addRepresentation("ball+stick", ballstickgreen);
                this.ligrepzn = dd.list[0].addRepresentation("ball+stick", ballstickorange);
                this.ligrepover = dd.list[0].addRepresentation("ball+stick", ballstick);
                console.log(this.rep);
                return "";
            };
            let t = "ffff";
            let r = `pippo ${t}`;
            this.rep = waitLoadNGL(this.stage);
        }

        console.log("--------SATGE--------");
        console.log(this.stage);
    }

    onRowClick = (record, index, event) => {
        console.log(`Click nth(${index}) row of parent, record.name: ${record.rna} ${record.rnu}`);
        // See https://facebook.github.io/react/docs/events.html for original click event details.
        console.log('CLICK STAGE --->', this.stage);
        let first = record.rnu + ".CA";
        this.stage.getComponentsByName("myProtein").addRepresentation("distance", {
            atomPair: [[first, "2.CA"]],
            color: "skyblue"
        });
        if (event.shiftKey) {
            console.log('Shift + mouse click triggered.');
        }
    };

    onRowDoubleClick = (record, index) => {
        console.log(`Double click nth(${index}) row of parent, record.name: ${record.rna} ${record.rnu}`);
    };

    doetest = () => {
        let dd = this.stage.getComponentsByName("myProtein");
        let s = dd.list[0].structure;
        console.log(s);
        dd.list[0].addRepresentation("ball+stick", {
            visible: true,
            // sele: "none",
            aspectRatio: 1.1,
            colorValue: "lightgrey",
            multipleBond: "symmetric"
        });
    };

    pippofun = (pippo) => {
        console.log(pippo);
    };

    showLigand = (sele) => {
        this.ligrep1.setVisibility(true);
        this.ligrep1.setSelection(sele);
        //ligandRepr.setVisibility(true);
        //ligandRepr.setSelection(sele);
    };

    showLigandclickui = (resid, name) => {
        console.log(`Click nth(${resid}) row of parent, record.name: ${resid} ${name}`);
        console.log(this.state);
        //  this.ligrep1.setVisibility(true);
        //  this.ligrep1.setSelection(resid);
        if (this.state.storezn) {
            this.setState({
                ...this.state,
                storezn: false,
                ligrepzn: resid,
                ligrepzn_table: resid
            });
            this.ligrepzn.setVisibility(true);
            this.ligrepzn.setSelection(resid);
        } else if (this.state.store1) {
            this.setState({
                ...this.state,
                store1: false,
                ligrep1: resid,
                ligrep1_table: resid
            });
            this.ligrep1.setVisibility(true);
            this.ligrep1.setSelection(resid);
        } else if (this.state.store2) {
            this.setState({
                ...this.state,
                store2: false,
                ligrep2: resid,
                ligrep2_table: resid
            });
            this.ligrep2.setVisibility(true);
            this.ligrep2.setSelection(resid);
        } else if (this.state.store3) {
            this.setState({
                ...this.state,
                store3: false,
                ligrep3: resid,
                ligrep3_table: resid
            });
            this.ligrep3.setVisibility(true);
            this.ligrep3.setSelection(resid);
        } else if (this.state.store4) {
            this.setState({
                ...this.state,
                store4: false,
                ligrep4: resid,
                ligrep4_table: resid
            });
            this.ligrep4.setVisibility(true);
            this.ligrep4.setSelection(resid);
        }
        //ligandRepr.setVisibility(true);
        //ligandRepr.setSelection(sele);
    };

    onmouseover = (resid, name) => {
        console.log(`Mouse Over nth(${resid}) row of parent, record.name: ${resid} ${name}`);
        console.log(this.state);
        this.ligrepover.setVisibility(true);
        this.ligrepover.setSelection(resid);
    };


    delselectlig = (lig) => {
        switch (lig) {
            case "1":
                this.setState({
                        ...this.state,
                        ligrep1: "none"

                    }
                );
                this.ligrep1.setVisibility(false);
                break;
            case "2":
                this.setState({
                        ...this.state,
                        ligrep2: "none"

                    }
                );
                this.ligrep2.setVisibility(false);
                break;
            case "3":
                this.setState({
                        ...this.state,
                        ligrep3: "none"

                    }
                );
                this.ligrep3.setVisibility(false);
                break;
            case "4":
                this.setState({
                        ...this.state,
                        ligrep4: "none"

                    }
                );
                this.ligrep4.setVisibility(false);
                break;
            case "zn":
                this.setState({
                        ...this.state,
                        ligrepzn: "none"

                    }
                );
                this.ligrepzn.setVisibility(false);
                break;
            default:
                return null;

        }
    };

    selectlig = (lig) => {
        switch (lig) {
            case "1":
                return this.setState({
                        ...this.state,
                        ligrep1_rep: "Clink ont table",
                        store1: true
                    }
                );
            case "2":
                return this.setState({
                        ...this.state,
                        ligrep2_rep: "Clink ont table",
                        store2: true
                    }
                );
            case "3":
                return this.setState({
                        ...this.state,
                        ligrep3_rep: "Clink ont table",
                        store3: true
                    }
                );
            case "4":
                return this.setState({
                        ...this.state,
                        ligrep4_rep: "Clink ont table",
                        store4: true
                    }
                );
            case "zn":
                return this.setState({
                        ...this.state,
                        ligrepzn_rep: "Clink ont table",
                        storezn: true
                    }
                );
            default:
                return null;

        }
    };

    showLigandclick = (record, index, event) => {
        console.log(`Click nth(${index}) row of parent, record.name: ${record.rna} ${record.rnu}`);
        this.ligrep1.setVisibility(true);
        this.ligrep1.setSelection(record.rna);
        //ligandRepr.setVisibility(true);
        //ligandRepr.setSelection(sele);
    };
    showLigandover = (sele) => {
        this.ligrepover.setVisibility(true);
        this.ligrepover.setSelection(sele);
        //ligandRepr.setVisibility(true);
        //ligandRepr.setSelection(sele);
    };
    showLigand1 = (sele) => {
        let dd = this.stage.getComponentsByName("myProtein");
        let s = dd.list[0].structure;
        console.log(sele);
        console.log(s);

        let ligandRepr = dd.list[0].addRepresentation("ball+stick", {
            //  visible: true,
            multipleBond: "symmetric",
            colorValue: "grey",
            sele: "none",
            aspectRatio: 1.2,
            radiusScale: 2.5
        });
        //ligandRepr.setVisibility(true);
        console.log(ligandRepr);
        ligandRepr.setSelection(sele);
        dd.list[0].autoView()

    };

    /* componentWillReceiveProps(nextProps, nextContext) {
     }*/

    render() {

        console.log("----------PDBJSON___________________");
        console.log(this.pdbjson);
        console.log(this.state);
        let printc = null;
        if (this.props.pdbfile.length > 0) {
            let pdbo = checkpdb(this.props.pdbfile);
            console.log(pdbo.chain);
            /*       printc =
                       <Printchains chain={new Map(pdbo.chain)} over={this.state.resoverngl} tablemouseover={this.onmouseover}
                                    sclick={this.showLigandclickui}
                                    dclick={this.onRowDoubleClick}/>*/
        }
        let cma;

        if (this.state.pdbfile.length > 0) {
            /*let matrix = calcdistance(this.state.pdbfile);
            let cma = findMetal(this.state.pdbfile);
            let rsmeam = residueMean(this.state.pdbfile);
            console.log(rsmeam);
            let dist = calcDistanceFromPoint(rsmeam,[1,1,1]);
            let slist = findMin(dist);

            console.log(rsmeam);
            console.log(cma);
            console.log(dist);
            console.log(slist);*/
            cma = findMetal(this.state.pdbfile);
            console.log("--------------ggggggg--------", cma);
        }
        console.log("NGLVIEW from render");
        console.log(this.state);
        return (
            <div>

                {/*<div id="viewport" style={{width: '400px', height: '400px'}}/>*/}
                <div id="viewport" className="ngl"/>
                <button onClick={this.doetest}
                        className="btn btn-danger">view ball and stick
                </button>
                <button onClick={() => this.showLigand("10:A")}
                        className="btn btn-danger">view ligand
                </button>
                <button
                    onClick={() => this.showLigand("30:A")}
                    className="btn btn-danger">view ligand1
                </button>
                <button onClick={this.saveParameter} className="btn btn-danger"> Save Paramater
                </button>
                {/*<button onClick={() => this.pippofun("-------PIPPO-------------")}*/}
                {/*        className="btn btn-danger">PIPPO*/}
                {/*</button>*/}
                {/*<button onClick={() => this.pippofun("-------PIPPO-------------")}*/}
                {/*        className="btn btn-danger">{this.state.resoverngl}*/}
                {/*</button>*/}
                {/* <ParamTbale selsetmetal={this.state.selsetmetal} setmetal={this.setMetal} listMetal={this.state.cma}
                            ligzn={this.state.ligrepzn_table} lig1={this.state.ligrep1_table}
                            lig2={this.state.ligrep2_table}
                            lig3={this.state.ligrep3_table} lig4={this.state.ligrep4_table}
                            delselectlig={this.delselectlig} selectlig={this.selectlig}/>*/}
                {/*{printc}*/}
                {
                    this.state.mes.length > 0 ?
                        <Grid item xs={3}>
                            <Select

                            label="Select Metal">
                                {this.state.mes.map((a) => (
                                    <MenuItem value={a}>{a}</MenuItem>
                                ))}

                            </Select>

                    </Grid> : ""
                }
            </div>
        )
    }
}

export default Pdbmanageclass;