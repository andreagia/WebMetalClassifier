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
public class Job {
    private String name;
    private String tag;
    private String directory;
    private String mail;
    private String command;
    private String exec;
    private String sessid;
    private List<String> pdb;
    private List<Submitjsonsingle> submitjsonsingles;
}