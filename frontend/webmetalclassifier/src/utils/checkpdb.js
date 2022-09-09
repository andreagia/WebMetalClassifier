
const checkpdb = (pdb) => {

    let filter1 = pdb.filter(a => a.match(/^ATOM/) || a.match(/^END/));
   // console.log(filter1);
    let prev = null;
    let chain = pdb.filter(a => a.match(/^ATOM/)).reduce((m, a) => {
        //console.log(a);
        let rnu = a.slice(22, 26).trim();
        let rna = a.slice(17, 20).trim();
        //console.log(a, rnu, rna, m);
        if (rnu !== prev) {
            m.set(rnu,rna);
        }
        prev = rnu;
        return m;
    }, new Map());

    return  {
        pdb: [...filter1],
        chain: chain
    };

};

export default checkpdb;