import * as math from 'mathjs';

const calcdistance = (pdb) => {
// create a vectoip with x,y,z atom coordinates
    //console.log("------------calcdistance---------------------");
    //console.log(pdb);
    let filter1 = pdb.filter(a => a.match(/^(ATOM|HETATM)/) && !a.match(/HOH/));
    //pdb.reduce((a,b) => {a.push(b);return a;}, []);
    console.log(filter1);
    let vector = filter1.reduce( (a, b)  => {
        a.push(b.substring(30, 54).split(/\s/).filter(Number).map(Number));
        return a;
    },[] );
    let m;
    //m = vector.reduce(((m,a,i) => vector.map((b,j) => m.set([i,j],math.distance(b,a)))), math.zeros(vector.length,vector.length));
    console.log(m);
    return m;
};

export default calcdistance