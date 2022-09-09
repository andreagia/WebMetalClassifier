package org.cirmmp.webmetalclassifier.service.run;

import org.cirmmp.webmetalclassifier.model.Job;
import org.cirmmp.webmetalclassifier.model.OutRunCommnad;

public interface RunCommandClassifier {
    OutRunCommnad runclassifier(Job job) throws Exception;
}
