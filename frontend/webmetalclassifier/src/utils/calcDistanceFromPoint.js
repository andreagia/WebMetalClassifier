import * as math from 'mathjs';

const calcDistanceFromPoint = (vec, point) => {
    let vdist = Object.keys(vec).reduce((v, a) => {
        v[a] = math.distance(vec[a],point);
        return v;
    }, {});
    return vdist;
};

export default calcDistanceFromPoint