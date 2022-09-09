import React, {useState, useEffect, useRef} from 'react';
import * as NGL from 'ngl';

export default function NGLview(props) {
    const {pdb, licorice1, licorice2, colors} = props;

    //console.log(pdb);
    //https://www.youtube.com/watch?v=MXSuOR2yRvQ
    const stage = useRef(null)
    const rep = useRef(null)
    useEffect(() => {
        if (stage.current == null) {
            stage.current = new NGL.Stage("viewport");
        }
    }, []);
    useEffect(() => {
        if (pdb.length > 0) {
            //https://codepen.io/pen?&editors=001&layout=left
            stage.current.removeAllComponents()
            const matchpdb = (item) => {
                return ((/^ATOM/.test(item) || /^HETATM/.test(item) || /^TER/.test(item) || /^END/.test(item)) && !/HOH/.test(item))
            };
            let dataArray = pdb.filter(item => matchpdb(item));
            let retpdb = dataArray.join("\n");
            //console.log("------- RET PDB ---------");
            //console.log(retpdb);
            let blob = new Blob([retpdb], {type: 'text/html'});
            const waitLoadNGL = async (o) => {
                await o.loadFile(blob, {name: "myProtein", ext: "pdb"});
                let dd = o.getComponentsByName("myProtein");
                //console.log(dd, o);
                //console.log(dd.list[0].structure);
                dd.list[0].addRepresentation("cartoon", {colorScheme: "atomindex"});

                if(licorice1.length > 0 ) dd.list[0].addRepresentation("ball+stick", {sele: licorice1.join(' '), color: 0xFF0000});
                console.log(licorice2);
                if(licorice2.length > 0 ) dd.list[0].addRepresentation("ball+stick", {sele: licorice2.join(' '), color: "yellow"});
                //dd.list[0].addRepresentation("ball+stick", {sele: "174-180"});

                if(licorice2.length > 0 ) {
                    // var residueHexColors = [0x00FF00, 0x00FF00, 0x00FF00];
                    //
                    // var myScheme = NGL.ColormakerRegistry.addScheme(function (params) {
                    //
                    //     this.atomColor = function (atom) {
                    //         // the residue index is zero-based, same order as in the loaded file
                    //         console.log("LENTO");
                    //         return residueHexColors[atom.residue.index];
                    //     };
                    //
                    // });
                    // dd.list[0].addRepresentation("surface", {
                    //     surfaceType: "ms",
                    //     smooth: 2,
                    //     probeRadius: 1.4,
                    //     scaleFactor: 2.0,
                    //     flatShaded: false,
                    //     opacity: 0.3,
                    //     lowResolution: false,
                    //     colorScheme: "bfactor"
                    // });
                }
                stage.current.autoView(1000)
            }
            rep.current = waitLoadNGL(stage.current);
        }
    }, [pdb])

    return (
        <div>
            <div id="viewport" className="ngl"/>
        </div>
    )
}