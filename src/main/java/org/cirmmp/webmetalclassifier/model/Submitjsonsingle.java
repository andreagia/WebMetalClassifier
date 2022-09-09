package org.cirmmp.webmetalclassifier.model;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvBindByPosition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class Submitjsonsingle {
    @CsvBindByName(column = "id", required = true)
    @CsvBindByPosition(position=0)
    private String id;
    @CsvBindByName(column = "name", required = true)
    @CsvBindByPosition(position=1)
    private String name;
    @CsvBindByName(column = "fasta", required = true)
    @CsvBindByPosition(position=2)
    private String fasta;
    @CsvBindByName(column = "accSolAbs", required = true)
    @CsvBindByPosition(position=3)
    private String accSolAbs;
    @CsvBindByName(column = "accsolrel", required = true)
    @CsvBindByPosition(position=4)
    private String accsolrel;
    @CsvBindByName(column = "bindigpar", required = true)
    @CsvBindByPosition(position=5)
    private String bindigpar;
    @CsvBindByName(column = "secstru", required = true)
    @CsvBindByPosition(position=6)
    private String secstru;
}
