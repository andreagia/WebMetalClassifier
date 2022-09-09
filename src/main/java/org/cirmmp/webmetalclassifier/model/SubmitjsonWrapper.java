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
public class SubmitjsonWrapper {
    private List<Submitjsonsingle> submitjsons;
}
