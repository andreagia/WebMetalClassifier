import React, {useState, useEffect} from 'react';
import makepdbjson from '../utils/makepdbjson'
import NGLview from "./NGLview";
import {FormControl, Grid, MenuItem, Select, Button, TableCell, TableContainer, Table, TableHead, TableRow , TableBody, Paper} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import findZones from "../utils/findZones";
import http from "../http-common";

const Pdbmanage = props => {
    const [pdbview, setpdbview] = useState([])
    const [pdbj, setpdbj] = useState({})
    const [mes, setMes] = useState([])
    const [metal, setMetal] = useState('')
    const [licorice1, setLicorice1] = useState([]);
    const [licorice2, setLicorice2] = useState([]);
    const {pdb} = props;
    const [naccessa, setNaccessa] = useState([]);
    const [naccessr, setNaccessr] = useState([]);
    const [secstru, setsecstru] = useState([]);
    const [resultc, setresulc] = useState([]);
    useEffect(() => {
        const pdbjson = makepdbjson(pdb);
        const mes = Object.keys(pdbjson["mes"])
        Object.keys(pdbjson["mes"]).forEach(a => {
            console.log(a);
            let findz = findZones(pdb, pdbjson['mes'][a]['info']['coord'], pdbjson['mes'][a]['info']['chain']);
            pdbjson['mes'][a]['zone1'] = [...findz.zone1];
            pdbjson['mes'][a]['zone2'] = [...findz.zone2];
        });
        console.log(pdbjson);
        setMes([...mes]);
        setpdbview(pdb)
        setpdbj(pdbjson)
        //console.log(pdbjson['mes']['ZN A 301']['info']['coord']);
        //const findz = findZones(pdb, [-10.865, 3.227, -6.215], "A");
        //console.log(findz);
    }, [pdb])

    const selectmetal = (event) => {
        const metal =event.target.value
        setMetal(metal);
        console.log(pdbj)
        console.log(pdbj['mes'][metal]['info']);
        setpdbview(pdbj['mes'][metal]['pdb'])
        let l1 = pdbj['mes'][metal]['zone1'].map(a => a.rnum);
        //l1.push(metal.split(" ")[2].trim());
        console.log(l1);
        setLicorice1(...[l1]);
        setLicorice2(...[pdbj['mes'][metal]['zone2']]);
        http.post('/run', {pdb: [...pdbj['mes'][metal]['pdb']], dirtmp: "naccess"}).then(res => {
            console.log("--------returned POST--------------")
            console.log(res.data.output);
            const outjcolor = {};
            const retacc = {};
            //console.log(res.data.output.filter( a => /^RES/.test(a)).map(b => b.split(/\s+/)[3]))
            //console.log(res.data.output.filter( a => /^RES/.test(a)).map(b => b.split(/\s+/)[4]))
            //res.data.output.map(a=>console.log(a));
            res.data.output.filter( a => /^RES/.test(a)).forEach(b => {
                outjcolor[b.split(/\s+/)[3]]=b.split(/\s+/)[4];
                retacc[b.split(/\s+/)[3]]=b.split(/\s+/)[5];
            })
            const sstru =  res.data.output.filter( a => (/^\s+/.test(a) && /[0-9]/.test(a.substring(4, 5)) &&  /[0-9]/.test(a.substring(9, 10)) && /[A-Z]/.test(a.substring(11, 13))) ).map(b => b.substring(16, 17));
            const mapdssp = {
                "H": "H",
                "B": "L",
                "E": "E",
                "G": "L",
                "I": "L",
                "P": "L",
                "T": "T",
                "S": "L"
            }
            const sstrurevised = sstru.map( a=> (Object.keys(mapdssp).includes(a)) ? mapdssp[a] : "L");
            console.log(sstrurevised);
            setsecstru(sstrurevised);
            console.log( outjcolor);
            setNaccessr(retacc);
            setNaccessa(outjcolor);
        })
    }

    const submitcalc = () => {
        const lig = [];
        const classjson = {};
        classjson['name'] = [...pdbj['mes'][metal]['secin']];
        classjson['accSolAbs'] = pdbj['mes'][metal]['secin'].map(a => naccessa[a.split("_")[1]]);
        classjson['accsolrel'] = pdbj['mes'][metal]['secin'].map(a => naccessr[a.split("_")[1]]);
        classjson['fasta'] = [...pdbj['mes'][metal]['fasta']];
        classjson["secstru"] = [...secstru];
        pdbj['mes'][metal]['secin'].forEach(a => {
            let res = a.split("_")[1];
            if(pdbj['mes'][metal]['zone2'].includes(res)) lig.push("2")
            else if(pdbj['mes'][metal]['zone1'].map(a=>a['rnum']).includes(res)) lig.push("1")
            else lig.push("0")
        })
        classjson['bindigpar'] = [...lig];
        console.log("classjson");
        console.log(classjson);
        console.log(Array.from(classjson));
        http.post('/submit', classjson).then(res => {
            console.log("--------returned POST--------------")
            console.log(res.data.output);
            const result = res.data.output.filter(a=> /^0/.test(a))[0].split(/\s+/)
            setresulc([...result]);

        });
    }
    return (
        <div>
            {mes.length > 0 ?
                <Grid item xs={3}>
                    <FormControl>
                        <InputLabel id="select-metal-label">Select ZN</InputLabel>
                        <Select
                            labelId="select-metal-label"
                            label="select-metal"
                            value={metal}
                            label="Metal"
                            onChange={selectmetal}>
                            {mes.map((a) => (
                                <MenuItem key={a} value={a}>{a}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid> : ""
            }
            <Grid item xs={12}>
             <NGLview pdb={pdbview} licorice2={licorice2} licorice1={licorice1} colors={naccessa}></NGLview>
            </Grid>
            <Grid item xs={12}>
            <Button disabled={metal.length == 0} onClick={submitcalc}>SUBMIT</Button>
            </Grid>
            {(resultc.length > 0) ?
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>

                                <TableCell align="right">P(random)</TableCell>
                                <TableCell align="right">P(physio)</TableCell>
                                <TableCell align="right">std.dev_random</TableCell>
                                <TableCell align="right">std.dev_physio</TableCell>
                                <TableCell align="right">#random</TableCell>
                                <TableCell align="right">#physio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                                <TableRow
                                    key={"Results"}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right">{resultc[2]}</TableCell>
                                    <TableCell align="right">{resultc[3]}</TableCell>
                                    <TableCell align="right">{resultc[4]}</TableCell>
                                    <TableCell align="right">{resultc[5]}</TableCell>
                                    <TableCell align="right">{resultc[6]}</TableCell>
                                    <TableCell align="right">{resultc[7]}</TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer> : <div/>

            }
        </div>
    )
}

export default Pdbmanage;