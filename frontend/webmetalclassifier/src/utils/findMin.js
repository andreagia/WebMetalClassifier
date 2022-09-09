const findMin = (vect) => {
    // convert object on Array of oject
    let tolist =  Object.keys(vect).reduce((v, a) =>
        {
            let ob = {[a]:vect[a]};
           // console.log(ob,v);
            v.push(ob);
            return v;
        }, []);
    // sort array on the first value
    return tolist.sort((a, b)=> {
        return Object.values(a)[0] - Object.values(b)[0]
    });
};
export  default findMin