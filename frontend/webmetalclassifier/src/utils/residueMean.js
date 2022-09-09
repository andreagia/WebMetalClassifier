import * as math from 'mathjs';
const residueMean = (pdb) => {

    let filter1 = pdb.filter(a => a.match(/^(ATOM|HETATM)/) && !a.match(/HOH/));
    let acc = filter1.reduce((v, a)=> {
        let rnum = a.substring(23, 26).trim();
        let rname = a.substring(17, 20).trim();
        let key = rname + " " + rnum;
        if (key in v) {
            v[key].push(a.substring(30, 54).split(/\s/).filter(Number).map(Number));
        } else {
            v[key]= [];
            v[key].push(a.substring(30, 54).split(/\s/).filter(Number).map(Number));
        }
        return v;
    },{});
    console.log(acc);
    let vmean = Object.keys(acc).reduce((v, a) => {
        let div = acc[a].reduce((w, i) => {
            //console.log(w,i,acc[a].length);
            w = math.add(w,i);
            return w;
        }, [0.0, 0.0, 0.0]);
        v[a] = math.dotDivide(div,acc[a].length);
        return v;
        }, {});
    return vmean;
};
export default residueMean