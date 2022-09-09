package org.cirmmp.webmetalclassifier.model;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class PostRun {
    private String firstName;
    private String lastName;
    private String email;
    private String dirtmp;
    private String run;
    private List<String> pdb;
}
