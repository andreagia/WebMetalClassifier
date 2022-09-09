import * as math from 'mathjs';

const findZones = (pdb, point, schain = "A") => {
    const zone1 = [];
    const zone1res = new Set();
    const zone1atoms = [];
    const zone2 = new Set();
    //remove H and WAT and HOH
    const filter1 = pdb.filter(a => (
        a.match(/^(ATOM|HETATM)/)
        && !(a.match(/HOH/) || a.match(/WAT/)))
        && (a.substring(76, 78).trim() !== "H")
        && (a.substring(21, 22).trim() === schain)
    );
    //console.log(filter1);
    filter1.forEach((a) => {
        let cor = a.substring(30, 54).split(/\s/).filter(Number).map(Number);
        let rnum = a.substring(23, 26).trim();
        let rname = a.substring(17, 20).trim();
        let aname = a.substring(12, 16).trim();
        let element = a.substring(76, 78).trim();
        let chain = a.substring(21, 22).trim();
        //console.log(cor,point[0]);
        let dist = math.distance(cor, point);
        if (element !== "C" && element !== 'H' && element !== 'ZN' && dist < 3.0) {
            zone1.push({
                'chain': chain,
                'cor': cor,
                'rnum': rnum,
                'rname': rname,
                'aname': aname,
                'dist': dist
            });
            zone1res.add(rnum);
        }
    });
    //extract atom coordinates for any heavy atoms on residues ont hthe set zone1res
    filter1.forEach((a) => {
        let rnum = a.substring(23, 26).trim();
        if(zone1res.has(rnum)) {
            zone1atoms.push(a.substring(30, 54).split(/\s/).filter(Number).map(Number));
        }
    });
    filter1.forEach((a) => {
        let cor = a.substring(30, 54).split(/\s/).filter(Number).map(Number);
        let dist = zone1atoms.map(b => math.distance(cor, b))
        if(Math.min(...dist) < 5.0) zone2.add(a.substring(23, 26).trim());
    });
    // remove residues of zone1 from zone2
    zone1.map(a => zone2.delete(a.rnum));

    const ret = {'zone1': zone1, 'zone2': Array.from(zone2)}

    return ret;
};
export default findZones;
