
const findMetal = (pdb) => {

    let filter1 = pdb.filter(a => a.match(/^(ATOM|HETATM)/) && !a.match(/HOH/));
    let vect= filter1.reduce((v, a)=> {
        let rnum = a.substring(23, 26).trim();
        let rname = a.substring(17, 20).trim();
        let key = rname + " " + rnum;
        if (key in v) {
            v[key] = v[key] + 1;
        } else {
            v[key] = 1;
    }
        return v;
    },{});

    return  Object.keys(vect).reduce((v, a) =>
    {
        let ob = {[a]:vect[a]};
        if (vect[a]===1) v.push(ob);
        return v;
    }, []);
};

export default findMetal
