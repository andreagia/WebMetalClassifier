import React from 'react';
import Table from 'rc-table';

//https://react-component.github.io/table/examples/rowAndCellClick.html

const printchains = (props) => {

    const columns = [{
        title: 'Residue number', dataIndex: 'rna', key:'rna', width: 200,
    }, {
        title: 'Residue name', dataIndex: 'rnu', key:'rnu', width: 100
    }];

    console.log('Printchains---> ',props.chain);
    let data = [];
    if (props.chain.size > 0) {
        props.chain.forEach((name, resid) => {data.push(
            {
                    key: resid,
                    rna: resid,
                    rnu: name
                });
        })
    }
   // console.log('DATA --->',data);

    return(
        <Table columns={columns}
               data={data}
               onRow={(record, index) => ({
                   // onClick: onRowClick.bind(null, record, index),
                   // onDoubleClick: onRowDoubleClick.bind(null, record, index),
                   onClick: props.sclick.bind(null, record, index),
                   onDoubleClick: props.dclick.bind(null, record, index)
               })}
        />
    )

};

export default printchains;