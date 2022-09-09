package org.cirmmp.webmetalclassifier.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class Submitjson {
//    dictionary[k1]["HHM"] = example_dict
//    dictionary[k1]["name"] = name
//    dictionary[k1]["fasta"] = fasta
//    dictionary[k1]["accsolrel"] = acsr
//    dictionary[k1]["AccSolAbs"] = acsa
//    dictionary[k1]["bindigpar"] = bpar
//    dictionary[k1]["secstru"] = secstru
   /* private List<String> AccSolAbs;
    private List<String> accsolrel;
    private List<String> fasta;
    private List<String> name;
    private List<String> secstru;
    private List<String> bindigpar;*/
    private List<String> accSolAbs;
    private List<String> accsolrel;
    private List<String> fasta;
    private List<String> name;
    private List<String> secstru;
    private List<String> bindigpar;
}
