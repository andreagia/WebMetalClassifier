//https://github.com/justinmc/parse-pdb/blob/master/index.js
import findNearRes from './findZones'

const makepdbjson = (pdb) => {

    const fasta = {
        ALA:"A", CYS:"C",
        ASP:"D", GLU:"E",
        PHE:"F", GLY:"G",
        HIS:"H", HID:"H",
        HIE:"H", ILE:"I",
        LYS:"K", LEU:"L",
        MET:"M", ASN:"N",
        PRO:"P", GLN:"Q",
        ARG:"R", SER:"S",
        THR:"T", VAL:"V",
        TRP:"W", TYR:"Y"
    };
    const pdbjson = {};
    pdbjson["mes"] = {};
    let naccess = pdb.filter(a => a.match(/^(ATOM|HETATM|TER|END)/) && !a.match(/HOH/));
    let filter1 = pdb.filter(a => a.match(/^(ATOM|HETATM)/) && !a.match(/HOH/));
    const findchainmetall = [];
    filter1.forEach((line => {
        let metal = line.substring(76, 78).trim();
        let chain = line.substring(21, 22).trim();
        let cor = line.substring(30, 54).split(/\s/).filter(Number).map(Number);
        let rnum = line.substring(23, 26).trim();
        let rname = line.substring(17, 20).trim();
        let aname = line.substring(12, 16).trim();
        if (metal === "ZN") findchainmetall.push(
            {
                'chain': chain,
                'metal': metal,
                'coord': cor,
                'rnum': rnum,
                'rname': rname,
                'aname': aname,
                'name': metal + " " + chain + " " + rnum

            }
        );
    }));
    const fastalist = [];
    if (findchainmetall.length > 0) {
        findchainmetall.forEach(a => {
            pdbjson["mes"][a.name] = {};
            pdbjson["mes"][a.name]["fasta"] = filter1.filter(b => b.substring(21, 22).trim() === a.chain)
                    .filter(c => (Object.keys(fasta).includes(c.substring(17, 20).trim()) && c.substring(12, 16).trim() === "CA"))
                    .map(d => fasta[d.substring(17, 20).trim()]).join("");
            pdbjson["mes"][a.name]["pdb"] = filter1.filter(b => b.substring(21, 22).trim() === a.chain);
            pdbjson["mes"][a.name]["info"] = a;
            pdbjson["mes"][a.name]["secin"] = filter1.filter(b => b.substring(21, 22).trim() === a.chain)
                .filter(c => (Object.keys(fasta).includes(c.substring(17, 20).trim()) && c.substring(12, 16).trim() === "CA"))
                .map(d => d.substring(17, 20).trim()+"_"+d.substring(23, 26).trim()+"_"+d.substring(21, 22).trim());


            }
        )
    } else {
        console.log("Error on PDB");
    }
    console.log(filter1.map(b => b.substring(76, 78).trim()))
    console.log(fastalist);
    console.log(findchainmetall);


    pdbjson["naccess"] = {};
    pdbjson["naccess"]["pdb"] = naccess;

    console.log(pdbjson);
    return pdbjson;
}

export default makepdbjson;